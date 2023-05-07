import React from "react";
import { Dimensions, View, Alert } from "react-native";
import { connect } from "react-redux";
import { types, alertActions } from "actions";
import { AppText, Container } from "components";
import styles from "./styles";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import QRCodeScanner from "react-native-qrcode-scanner";
import * as Animatable from "react-native-animatable";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { finderRequest } from "actions/contactActions";
import { Const } from "helper";

const _ = require("lodash");

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const STATUS_BAR_HEIGHT = getStatusBarHeight(isIphoneX);

class QRScanDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusedScanner: "",
            showCamera: false,
            reactivate: true,
            vibration: props.settingReducer.data.vibration
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ showCamera: true });
        }, 200);
        const { navigation } = this.props;
        navigation.addListener("willFocus", () => this.setState({ focusedScanner: true }));
        navigation.addListener("willBlur", () => this.setState({ focusedScanner: false }));
    }

    componentDidUpdate(prevProps) {
        const { userReducer, contactReducer, navigation, settingReducer, dispatch } = this.props;
        let { reactivate } = this.state;
        if (prevProps.contactReducer !== contactReducer && !reactivate) {
            if (contactReducer.type === types.FINDER_SUCCESS) {
                if (
                    !_.isEmpty(contactReducer.dataFinder.results) &&
                    userReducer.data.id !== contactReducer.dataFinder.results[0].id
                ) {
                    if (userReducer.data.type == 1 || contactReducer.dataFinder.results[0].type == 0) {
                        this.setState({ reactivate: true }, () => {
                            navigation.navigate("AddContact");
                        });
                    } else {
                        let data = contactReducer.dataFinder.results[0];
                        // let contact = {
                        //     id: data.id,
                        //     nickname: data.user.first_name + " " + data.user.last_name,
                        //     avatar: data.avatar,
                        //     // of_user: userReducer.data.id,
                        //     about_user: data
                        // };
                        this.setState({ reactivate: true }, () => {
                            navigation.navigate("DetailTeacher", { contact: { teacher: data } });
                        });
                    }
                    this.setState({ phone: "" });
                } else {
                    setTimeout(() => {
                        const paramsAlert = {
                            content: I18n.t("Alert.cantFindPhone"),
                            title: I18n.t("Alert.notice"),
                            type: Const.ALERT_TYPE.INFO
                        };
                        dispatch(alertActions.openAlert(paramsAlert));
                        this.setState({ reactivate: true });
                    }, 200);
                }
                return;
            }

            if (contactReducer.type == types.FINDER_FAILED) {
                setTimeout(() => {
                    this.setState({ reactivate: true });
                }, 200);
                return;
            }
            if (contactReducer.type == types.ALERT_CLOSE) {
                this.setState({ reactivate: true });
                return;
            }
            if (prevProps.settingReducer !== settingReducer) {
                this.setState({ vibration: settingReducer.data.vibration });
            }
        }
    }

    onSuccess = e => {
        const { dispatch } = this.props;
        const { reactivate } = this.state;

        let param = {
            qrCode: e.data
            // qrCode: "15_0327199482"
        };
        if (reactivate) {
            this.setState({ reactivate: false }, () => {
                dispatch(finderRequest(param));
            });
        }
    };

    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: SCREEN_WIDTH * -0.18
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    renderScanner = () => {
        let { showCamera, vibration } = this.state;
        return showCamera ? (
            <QRCodeScanner
                onRead={this.onSuccess}
                showMarker={true}
                fadeIn={false}
                vibrate={false}
                reactivate={true}
                reactivateTimeout={2000}
                cameraStyle={{ height: SCREEN_HEIGHT - STATUS_BAR_HEIGHT }}
                customMarker={
                    <View style={styles.rectangleContainer}>
                        <View style={styles.topOverlay}>
                            <AppText
                                style={{ fontSize: 20, color: "white", textAlign: "center" }}
                                text={I18n.t("QRScan.content")}
                            />
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.leftAndRightOverlay} />

                            <View style={styles.rectangle}>
                                {/* <Icon name="ios-qr-scanner" size={SCREEN_WIDTH * 0.73} color="#fff" /> */}
                                <View style={{ height: SCREEN_WIDTH * 0.8 }} />
                                <Animatable.View
                                    style={styles.scanBar}
                                    direction="alternate-reverse"
                                    iterationCount="infinite"
                                    duration={1700}
                                    easing="linear"
                                    animation={this.makeSlideOutTranslation("translateY", SCREEN_WIDTH * -0.65)}
                                />
                            </View>

                            <View style={styles.leftAndRightOverlay} />
                        </View>

                        <View style={styles.bottomOverlay} />
                    </View>
                }
            />
        ) : null;
    };

    render() {
        // Vibration.cancel();
        const { userReducer, navigation } = this.props;
        const { focusedScanner } = this.state;

        return (
            <Container scrollEnabled={false}>
                <HeaderApp
                    title={I18n.t("QRScan.QRScan")}
                    isBack
                    leftOnPress={() => {
                        userReducer.data.type
                            ? navigation.navigate("MainTabContainerTeacher", { drawer: "drawer" })
                            : navigation.navigate("MainTabContainer", { drawer: "drawer" });
                    }}
                    // navigation={this.props.navigation}
                />
                {focusedScanner ? this.renderScanner() : null}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer,
        settingReducer: state.settingReducer
    };
}

QRScanDrawer = connect(mapStateToProps)(QRScanDrawer);
export default QRScanDrawer;
