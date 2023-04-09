import React from "react";
import { View, Keyboard, Platform, Modal, Linking, Alert, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import SlidingUpPanel from "rn-sliding-up-panel";
import { DEVICE, DIMENSION, permissions, resultPermission } from "../../helper/Consts";
import HeaderApp from "components/Header";
import I18n from "helper/locales";

import { Markers, MarkerSelected, ContentUpPanel, SubjectBar } from "./Component";
import { checkMarker } from "./functions";
import styles from "./styles";
import FastImage from "react-native-fast-image";
import { ICON } from "assets";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { AppImage, FloatInput, AppText, Button } from "components";
import { Const, Colors } from "helper";
import Permissions, { openSettings } from "react-native-permissions";
import { getMapTeacherRequest } from "actions/teacherAction";
import { types } from "actions";
import AutocompleteLocation from "components/AutocompleteLocation";
import HeaderMap from "components/HeaderMap";
import { openAlert } from "actions/alertActions";
import OpenAppSettings from "react-native-app-settings";
import { Icon } from "native-base";
import firebase from "@react-native-firebase/app";
import Geolocation from "@react-native-community/geolocation";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

const HEIGHT = DEVICE.DEVICE_HEIGHT - DIMENSION.STATUS_BAR_HEIGHT - DIMENSION.HEADER_HEIGHT;
const TWO_TEACHER = 320;
const NONE_TEACHER = 0;
const HEADER_HEIGHT = 70;
const MAP_HEIGHT_DEFAULT = DEVICE.DEVICE_HEIGHT - NONE_TEACHER - HEADER_HEIGHT;
const MAP_HEIGHT_SELECTED = DEVICE.DEVICE_HEIGHT - TWO_TEACHER;

class Maps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coords: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
            },
            data: [],
            selectedId: -1,
            btmUpPanel: NONE_TEACHER,
            mapHeight: MAP_HEIGHT_DEFAULT,
            subjectChoice: {},
            showMarker: false,
            showModal: false,
            address: "",
            focus: false,
            press: false,
            valueSearch: "",
            showAlert: false,
            onlineStatus: []
        };
    }

    dismissKeyboard() {
        Keyboard.dismiss();
    }

    componentDidMount() {
        this.getOnlineStatus();
        setTimeout(() => {
            this.getCurrentLocation();
        }, 500);
    }

    componentDidUpdate(prevProps) {
        const { searchMapTeacherReducer, navigation, dispatch } = this.props;
        if (prevProps.searchMapTeacherReducer !== searchMapTeacherReducer) {
            this.setState({ press: false });
            // if (searchMapTeacherReducer.type === types.GET_MAP_TEACHER_FAILED) {
            // }
            if (searchMapTeacherReducer.type === types.GET_MAP_TEACHER_SUCCESS) {
                this.setState({ data: searchMapTeacherReducer.dataMapTeacher.response.results });
            }
        }
    }

    getOnlineStatus() {
        firebase
            .database()
            .ref(`/status/`)
            .on("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                this.setState({ onlineStatus: value });
            });
    }

    onPressMarker(item) {
        let { selectedId, btmUpPanel, mapHeight, data } = this.state;
        selectedId = checkMarker(selectedId, item.id);
        btmUpPanel = TWO_TEACHER;
        mapHeight = MAP_HEIGHT_SELECTED;
        let index = data.findIndex(item => selectedId == item.id);
        this.setState(
            {
                selectedId,
                btmUpPanel,
                mapHeight,
                coords: {
                    latitude: item.latitude,
                    longitude: item.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                }
            },
            () => {
                setTimeout(() => {
                    // this.panel.show();
                    if (index > -1) {
                        this.flatListRef.scrollToIndex({
                            animated: true,
                            index: data.length - 1 == index && data.length - 1 > 0 ? index - 1 : index
                        });
                    }
                }, 1000);
            }
        );
    }

    renderMarker() {
        let { data, selectedId } = this.state;

        return data.map((item, index) => {
            if (item.latitude == 0 && item.longitude == 0) {
                return null;
            } else {
                return item.id == selectedId ? (
                    <MarkerSelected
                        key={index}
                        coords={{
                            latitude: item.latitude,
                            longitude: item.longitude
                        }}
                        text={`Gv. ${item.user.first_name} ${item.user.last_name}`}
                        onPress={() => this.onPressMarker(item)}
                    />
                ) : (
                    <Markers
                        key={index}
                        coords={{
                            latitude: item.latitude,
                            longitude: item.longitude
                        }}
                        onPress={() => this.onPressMarker(item)}
                    />
                );
            }
        });
    }
    renderCompleteLocation() {
        const { address, editer, showModal, subjectChoice } = this.state;

        const { dispatch } = this.props;
        return (
            <AutocompleteLocation
                {...this.props}
                ref={ref => (this.inputLocation = ref)}
                showModal={showModal}
                onPressText={() => this.setState({ showModal: true })}
                onPressCancel={() => this.setState({ showModal: false })}
                location
                icon
                editable={editer}
                onFocus={() => this.setState({ focus: true })}
                onBlur={() => this.setState({ focus: false, press: false })}
                style={styles.input}
                onChange={(street1, location) => {
                    this.setState({
                        valueSearch: street1,
                        showModal: false,
                        selectedId: -1,
                        coords: {
                            latitude: location.lat,
                            longitude: location.lng,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        },
                        btmUpPanel: 30
                    });
                    const params = subjectChoice.id
                        ? {
                              latitude: location.lat,
                              longitude: location.lng,
                              type: 1,
                              topic: subjectChoice.id
                          }
                        : {
                              latitude: location.lat,
                              longitude: location.lng,
                              type: 1
                          };
                    dispatch(getMapTeacherRequest(params));
                }}
                // onPress={press && null}
                multiline={true}
            />
        );
    }
    searchTeacher(value) {
        if (this.state.valueSearch) {
            this.setState({ btmUpPanel: NONE_TEACHER, valueSearch: "", selectedId: -1, mapHeight: MAP_HEIGHT_DEFAULT });
        } else {
            this.setState({ showModal: true });
        }
    }

    renderMapView() {
        let { coords, mapHeight, showMarker, data } = this.state;
        return (
            <MapView
                ref={ref => (this.mapView = ref)}
                style={{ height: mapHeight, width: DEVICE.DEVICE_WIDTH }}
                onPress={() => this.dismissKeyboard()}
                provider={PROVIDER_GOOGLE}
                region={coords}
                showsUserLocation
                moveOnMarkerPress
            >
                {data.length > 0 ? this.renderMarker() : null}
            </MapView>
        );
    }

    onPressItem(item) {
        const { dispatch } = this.props;
        const { coords } = this.state;
        this.setState({ subjectChoice: item });
        const params = {
            // latitude: coords.latitude,
            // longitude: coords.longitude,
            topic: item.id,
            type: 1
        };
        dispatch(getMapTeacherRequest(params));
    }

    renderSubjectBar() {
        const { tNsReducer } = this.props;
        let { btmUpPanel } = this.state;
        const dataSubject = tNsReducer.dataTopic;
        return (
            <SubjectBar
                data={dataSubject}
                onPressItem={item => this.onPressItem(item)}
                style={{ display: btmUpPanel > 0 ? "none" : "flex" }}
            />
        );
    }

    renderSlidingUpPanel() {
        let { data, selectedId, btmUpPanel, valueSearch, onlineStatus } = this.state;

        const { navigation } = this.props;
        return (
            <View
                ref={c => (this.panel = c)}
                // draggableRange={{
                //     top: btmUpPanel,
                //     bottom: 0
                // }}
                style={{ height: btmUpPanel }}
                // height={btmUpPanel}
                // allowDragging={false}
            >
                <ContentUpPanel
                    onListTeacher={() => {
                        const { btmUpPanel } = this.state;
                        if (btmUpPanel == HEIGHT) {
                            this.setState({ btmUpPanel: TWO_TEACHER });
                        } else {
                            this.setState({ btmUpPanel: HEIGHT });
                        }
                    }}
                    closeList={() => {
                        valueSearch
                            ? this.setState({ btmUpPanel: 30, selectedId: -1, mapHeight: MAP_HEIGHT_DEFAULT })
                            : this.setState({
                                  btmUpPanel: NONE_TEACHER,
                                  selectedId: -1,
                                  mapHeight: MAP_HEIGHT_DEFAULT
                              });
                    }}
                    data={data}
                    selectId={selectedId}
                    refFlatlist={ref => (this.flatListRef = ref)}
                    onPress={item => navigation.navigate("DetailTeacher", { contact: { teacher: item } })}
                    pressHand={data => this.onPressMarker(data)}
                    onlineStatus={onlineStatus}
                />
            </View>
        );
    }

    renderFooter() {
        let { showMarker, btmUpPanel } = this.state;
        return (
            <View style={styles.upPanelWrap}>
                {this.renderSlidingUpPanel()}
                {this.renderSubjectBar()}
            </View>
        );
    }

    renderFloatImage(source = ICON.DIRECTION) {
        return (
            <AppImage
                local
                source={source}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                    height: DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.8,
                    width: DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.8
                }}
            />
        );
    }

    onPressDirection() {
        this.setState({ showMarker: true });
    }

    renderDirectionBtn() {
        let { showMarker } = this.state;
        if (!showMarker) {
            return (
                <View
                    style={{
                        position: "absolute",
                        bottom: DIMENSION.MAP_BOTTOM_BAR_HEIGHT + DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.15,
                        right: DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.15
                    }}
                >
                    <TouchableOpacity onPress={() => this.onPressDirection()}>
                        {this.renderFloatImage(ICON.DIRECTION)}
                    </TouchableOpacity>
                </View>
            );
        }
    }

    onPressMyLocation() {
        // alert("kadlkads");
        this.getCurrentLocation();
    }

    renderMyLocationBtn() {
        let { showMarker } = this.state;
        if (!showMarker) {
            return (
                <View
                    style={{
                        position: "absolute",
                        bottom: DIMENSION.MAP_BOTTOM_BAR_HEIGHT + DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.15,
                        // bottom:
                        //     DIMENSION.MAP_BOTTOM_BAR_HEIGHT +
                        //     DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.15 +
                        //     DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.8 +
                        //     DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.15,
                        right: DIMENSION.MAP_SUBJECT_BTN_WIDTH * 0.15
                    }}
                >
                    <TouchableOpacity onPress={() => this.onPressMyLocation()}>
                        {this.renderFloatImage(ICON.CURRENT_LOCATION)}
                    </TouchableOpacity>
                </View>
            );
        }
    }
    checkAndroidLocation(error) {
        if (error != "No location provider available." || Platform.OS == "ios") return;
        // const { checkPositionAndroid } = this.state;
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(data => {
                console.log("checkLocation ==> TRUE", data);
                // this.setState({ checkPositionAndroid: true });
            })
            .catch(err => {
                console.log("checkLocation ==> FALSE", err);
                // this.setState({ checkPositionAndroid: false });
            });
    }
    getNSendLocation() {
        const { dispatch } = this.props;
        const paramsAlert = {
            content: I18n.t("Alert.permissionLocation"),
            title: I18n.t("Alert.notice"),
            type: Const.ALERT_TYPE.WARNING
        };
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                let currentParams = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                };
                this.setState({ coords: currentParams });
                const params = {
                    latitude: latitude,
                    longitude: longitude,
                    type: 1
                };
                dispatch(getMapTeacherRequest(params));
            },
            error => {
                this.setState({ servicesOn: false });
                // Permissions.openSettings();
                console.log(error);
                Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.turnOnLocation"), [
                    {
                        text: I18n.t("Alert.cancel"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.checkAndroidLocation(error.message) }
                ]);
            }
            // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }
    modalLocation() {
        const { showAlert } = this.state;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showAlert}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                }}
            >
                <View style={styles.containerModal}>
                    <View style={styles.contentModal}>
                        <View style={styles.headerModal}>
                            <View style={[styles.headerImage, { backgroundColor: Colors.YELLOW_COLOR }]}>
                                <Icon name="ios-information" style={{ fontSize: 50, color: "white" }} />
                            </View>
                        </View>
                        <View style={styles.bodyModal}>
                            <AppText text={I18n.t("Alert.notice")} style={styles.titleAlert} />
                            <AppText text={I18n.t("Alert.permissionLocation")} style={styles.contentAlert} />
                            <Button
                                style={{ width: 150, height: 40 }}
                                title={"OK"}
                                onPress={() => {
                                    this.setState({ showAlert: false }, () => {
                                        OpenAppSettings.open();
                                    });
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
    async getCurrentLocation() {
        let { dispatch } = this.props;
        const paramsAlert = {
            type: Const.ALERT_TYPE.WARNING,
            title: I18n.t("Alert.notice"),
            content: I18n.t("Alert.permissionLocation")
        };
        // const response = await Permissions.check(permissions.LOCATION);
        Permissions.request(permissions.LOCATION).then(response => {
            console.log('response----',response
            );
            if (response == resultPermission.GRANTED) {
                this.getNSendLocation();
            } else if (response == resultPermission.BLOCKED) {
                this.setState({ showAlert: true });
            } else if (response == resultPermission.DENIED) {
                dispatch(openAlert(paramsAlert));
                // if (Platform.OS === "android") {
                //     Permissions.request(permissions.LOCATION).then(response => {
                //         if (response == resultPermission.GRANTED) {
                //             this.getNSendLocation();
                //         } else {
                //             dispatch(openAlert(paramsAlert));
                //         }
                //     });
                // } else {
                //     this.getNSendLocation();
                // }
            } else if (response == "unavailable") {
                if (Platform.OS === "ios") {
                    Alert.alert(
                        I18n.t("Alert.openSetting"),
                        I18n.t("Alert.locationOff"),
                        [
                            {
                                text: I18n.t("Alert.no"),
                                onPress: () => {},
                                style: "cancel"
                            },
                            { text: I18n.t("Alert.openSetting"), onPress: () => openSettings() }
                        ],
                        { cancelable: false }
                    );
                }
            }
        });
    }
    render() {
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <HeaderMap
                    valueSearch={this.state.valueSearch}
                    isSearch
                    title={I18n.t("map.findTeacher")}
                    navigation={navigation}
                    isBack
                    rightOnPress={value => this.searchTeacher(value)}
                />
                {this.renderMapView()}
                {this.renderFooter()}
                {/* {this.renderDirectionBtn()} */}
                {this.renderMyLocationBtn()}
                {this.renderCompleteLocation()}
                {this.modalLocation()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        searchMapTeacherReducer: state.searchMapTeacherReducer,
        tNsReducer: state.tNsReducer
    };
}
Maps = connect(mapStateToProps)(Maps);
export default Maps;
