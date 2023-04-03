/* eslint-disable react/no-unused-state */
import React from "react";
import {
    TouchableOpacity,
    View,
    Dimensions,
    Modal,
    KeyboardAvoidingView,
    TextInput,
    Platform,
    Alert
} from "react-native";
import { Const, GlobalStyles, Helper, ServiceHandle, Colors, Validate } from "../helper";
import I18n from "../helper/locales";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Icon } from "react-native-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AppText from "./AppText";
import AppImage from "./AppImage";
import Input from "./Input";
import { Button, Container } from "./index";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { PD, GOOGLEMAP_API } from "../helper/Consts";
import { FONT_SF } from "../assets";
import Geocoder from "react-native-geocoding";
// Geocoder.init("AIzaSyDkFMIeid4Uylo15n2_DgmiA0nzJxaT0Yc");
Geocoder.init(GOOGLEMAP_API);
const { width, height } = Dimensions.get("window");
export default class AutocompleteLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            dataAddress: props.data,
            // showModal: false,
            showLocation: false
        };
    }

    onChange(location) {
        const { onChange } = this.props;
        const { dataAddress } = this.state;
        Geocoder.from(location.formatted_address)
            .then(json => {
                var locationGeo = json.results[0].geometry.location;
                if (onChange) {
                    onChange(dataAddress, locationGeo);
                }
            })
            .catch(error => {
                Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.locationError"), [{ text: "OK" }], {
                    cancelable: false
                });
            });
    }

    // showModal() {
    //     this.setState({ showModal: true });
    // }

    renderModalPlace() {
        let { showModal, title, onPressCancel = () => {}, modalVisibleToggle = () => {} } = this.props;
        return (
            <Modal visible={showModal} coverScreen={false} onRequestClose={modalVisibleToggle}>
                <View style={{ backgroundColor: Colors.CONTENT_COLOR, flex: 1 }}>
                    {Platform.OS == "ios" && (
                        <View style={{ height: getStatusBarHeight(isIphoneX()), backgroundColor: "rgba(0,0,0,0.1)" }} />
                    )}
                    <Container
                        style={{
                            width: "100%",
                            height: "100%",
                            paddingTop: PD.PADDING_3
                            // backgroundColor: Colors.SKY_BLUE
                        }}
                    >
                        <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 20 }}>
                            <View style={{ flex: 1 }} />
                            <AppText
                                text={title}
                                style={{
                                    fontFamily: FONT_SF.MEDIUM,
                                    fontSize: responsiveFontSize(2.25),
                                    textAlign: "center"
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    flex: 1,
                                    padding: PD.PADDING_2
                                }}
                                onPress={() => onPressCancel()}
                            >
                                <AppText
                                    text={I18n.t("CallScreen.cancel")}
                                    style={{
                                        fontFamily: FONT_SF.MEDIUM,
                                        fontSize: responsiveFontSize(2.25),
                                        color: Colors.MAIN_COLOR
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <GooglePlacesAutocomplete
                            placeholder="Search"
                            minLength={2} // minimum length of text to search
                            autoFocus={true}
                            returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            keyboardAppearance="light" // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                            listViewDisplayed="auto" // true/false/undefined
                            fetchDetails
                            renderDescription={row => row.description} // custom description render
                            onPress={(data, details) => {
                                // 'details' is provided when fetchDetails = tr
                                this.setState(
                                    {
                                        dataAddress: data.description
                                        //  showModal: false
                                    },
                                    () => {
                                        this.onChange(details);
                                    }
                                );
                            }}
                            getDefaultValue={() => ""}
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: "AIzaSyAlJXYuanUUxcC_4fKs66a93E0W1QxeIXg",
                                language: "en" // language of the results
                            }}
                            styles={{
                                textInputContainer: {
                                    width: "100%",
                                    marginBottom: 10,
                                    backgroundColor: "#f5f5f5"
                                },
                                description: {
                                    fontWeight: "bold"
                                },
                                predefinedPlacesDescription: {
                                    color: "#1faadb"
                                }
                            }}
                            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GoogleReverseGeocodingQuery={
                                {
                                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                }
                            }
                            GooglePlacesDetailsQuery={{
                                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                fields: "formatted_address"
                            }}
                            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                        />
                    </Container>
                </View>
            </Modal>
        );
    }

    render() {
        let {
            style,
            data,
            titleStyle,
            isShadow,
            icon,
            iconStyle,
            iconColor,
            color,
            location,
            onPress = () => {}
        } = this.props;
        let { dataAddress, showLocation } = this.state;

        return (
            <KeyboardAvoidingView
                style={{ width: "100%", flexDirection: "row", alignItems: "center", backgroundColor: Colors.SKY_BLUE }}
                behavior="padding"
                enabled
            >
                {/* {icon ? <AppImage style={styles.imgIcon} resizeMode="contain" source={Images.icplace} /> : null} */}
                {!location ? (
                    data ? (
                        <Input
                            onPress={() => {
                                this.setState({
                                    // showModal: true,
                                    showLocation: true
                                });
                            }}
                            editAble={false}
                            style={styles.input}
                            value={dataAddress}
                        />
                    ) : (
                        <Input
                            onPress={() => {
                                this.setState({
                                    // showModal: true
                                });
                            }}
                            editAble={false}
                            style={styles.input}
                            value={dataAddress}
                        />
                    )
                ) : (
                    <TextInput {...this.props} onPress={() => onPressText()} />
                )}
                <TouchableOpacity
                    style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
                    onPress={() => {
                        // this.setState({ showModal: true });
                    }}
                />
                {this.renderModalPlace()}
            </KeyboardAvoidingView>
        );
    }
}

let styles = {
    textInputLogin: {
        width: "100%",
        marginTop: 10,
        flex: 6,
        flexDirection: "row",
        height: 44,
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "white"
    },
    imgIcon: {
        flex: 1,
        paddingLeft: 40,
        width: 15,
        height: 15
    },
    input: {
        width: "80%",
        height: "100%",
        color: Colors.MAIN_COLOR,
        marginRight: 20
    }
};
