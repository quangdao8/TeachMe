import React from "react";
import { connect } from "react-redux";
import { FlatList, TouchableOpacity, View, Image, Share, Platform, Alert, AsyncStorage, AppState } from "react-native";
import { AppImage, AppText, AppImageCircle } from "components";
import { PD, DIMENSION, USER_TYPE, DEVICE, permissions, resultPermission } from "helper/Consts";
import { Colors, Const } from "helper";
import { ICON, FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { drawerActions, userActions } from "actions";
import { logoutRequest } from "actions/userActions";
import { removeContact } from "actions/contactActions";
const _ = require("lodash");
import I18n from "helper/locales";
import { numberToCurrency } from "helper/convertLang";
import { ServiceHandle } from "helper";

import firebase from "@react-native-firebase/database";
import Permissions from "react-native-permissions";
import { HAS_CALL } from "actions/types";
import { openAlert } from "actions/alertActions";
const MICROPHONE = permissions.MICROPHONE;
const CAMERA = permissions.CAMERA;
const grated = resultPermission.GRANTED;
const blocked = resultPermission.BLOCKED;
class Drawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: Colors.WHITE_COLOR,
            colorDis: "#5be37f",
            id: "",
            userRe: props.userReducer,
            isRef: false,
            uuid: ""
        };
        this.params = "";
        this.isToVideoCall = false;
    }

    renderItemRoutes(item) {
        const { id } = this.state;
        return (
            <TouchableOpacity
                style={{
                    width: "100%",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: PD.PADDING_3,
                    paddingLeft: PD.PADDING_4
                }}
                onPress={() => this.onPress(item)}
            >
                <AppImage
                    local
                    style={{
                        width: responsiveFontSize(2.3),
                        height: responsiveFontSize(2.3)
                    }}
                    resizeMode="contain"
                    source={item.img}
                />
                <AppText
                    style={{
                        fontSize: responsiveFontSize(2.1),
                        color: this.state.color,
                        marginLeft: PD.PADDING_4,
                        fontFamily: FONT_SF.REGULAR,
                        alignSelf: "center"
                    }}
                    text={item.name}
                />
            </TouchableOpacity>
        );
    }

    endCall = ({ callUUID }) => {
        console.log("callUUID", callUUID);
    };

    renderLeftIcon(icon) {
        return <AppImage local source={icon} style={{ height: 23, width: 23 }} resizeMode="contain" />;
    }

    checkPermission = type => {
        Permissions.check(type).then(response => {
            if (response === grated) {
                Permissions.check(CAMERA).then(response => {
                    if (response == grated) {
                    } else if (response == blocked) {
                        alert(I18n.t("Alert.notPermission") + "camera" + I18n.t("Alert.forApp"));
                    } else {
                        Permissions.request(CAMERA);
                    }
                });
            } else if (response == blocked) {
                alert(I18n.t("Alert.notPermission") + type + I18n.t("Alert.forApp"));
            } else {
                Permissions.request(type).then(response => {
                    if (response === grated) {
                        Permissions.check(CAMERA).then(response => {
                            if (response == grated) {
                            } else if (response == blocked) {
                                alert(I18n.t("Alert.notPermission") + "camera" + I18n.t("Alert.forApp"));
                            } else {
                                Permissions.request(CAMERA);
                            }
                        });
                    }
                });
            }
        });
    };

    async componentWillMount() {
        // getChatRoomDetail(105).then(res => {
        //     console.log("response drawer", res);
        // });
        this.checkPermission(MICROPHONE);
        if (Platform.OS === "android") {
            this.firebaseA = firebase
                .database()
                .ref(`video-call/${this.state.userRe.data.id}`)
                .limitToLast(1)
                .on("child_added", childSnapshot => {
                    let lastItem = childSnapshot.toJSON();
                    const { to, caller, status } = lastItem;
                    if (status === "dialing") {
                        const userRe = this.state.userRe || {};
                        const { data = {}, type = "" } = userRe;

                        const { id: myId = 0 } = data;
                        // getUserData()
                        if (to === myId && !!userRe && type !== "LOGOUT" && !!data) {
                            const { settingReducer = {} } = this.props;
                            const { data = {} } = settingReducer;
                            const { soundCall = true, vibrationCall = true, onlineStatus = true } = data;
                            // if (!!settingReducer && onlineStatus) {
                            ServiceHandle.get(`call_log_user/${userRe.data.id}/`)
                                .then(res => {
                                    if (!res.error) {
                                        lastItem.isRingtone = soundCall;
                                        lastItem.isCallVibration = vibrationCall;
                                        // this.props.navigation.push("IncomingCall", {
                                        //     callData: lastItem
                                        // });
                                    }
                                })
                                .catch(e => {
                                    console.log("error get call", e);
                                });
                            // }
                        }
                    }

                    if (status === "finished" && !!this.state.userRe && !!this.state.userRe.data) {
                        firebase
                            .database()
                            .ref(`video-call/${this.state.userRe.data.id}`)
                            .remove();
                    }
                });
        }
    }

    componentDidUpdate(prev) {
        const { dispatch, navigation, alertReducer, userReducer, navigateReducer, settingReducer } = this.props;
        const { state } = navigation;
        const currentRoot = state.routes[state.index];
        if (!navigation.state.isDrawerOpen) {
            clearTimeout(this.closeDrawer);
            this.closeDrawer = setTimeout(() => {
                dispatch(drawerActions.closeDrawer());
            }, 500);
        }
        if (prev.userReducer !== userReducer) {
            if (userReducer) {
                this.setState({ userRe: userReducer });
            }
            if (userReducer.type === HAS_CALL) {
                const { dataCall } = userReducer;
                const { avatar, caller, callerName, isCanReceive, isVideo, status, to, voipToken } = dataCall;
                if (Platform.OS !== "ios") {
                    setTimeout(() => {
                        firebase
                            .database()
                            .ref(`video-call/${caller}`)
                            .push({
                                caller: JSON.parse(caller),
                                to: JSON.parse(to),
                                status: "connected",
                                isCanReceive: JSON.parse(isCanReceive),
                                isVideo: JSON.parse(isVideo),
                                media: {
                                    width: DEVICE.DEVICE_WIDTH,
                                    height: DEVICE.DEVICE_HEIGHT
                                }
                            })
                            .then(() => {
                                if (!this.isToVideoCall) {
                                    this.isToVideoCall = true;
                                    this.props.navigation.push("VideoCall", {
                                        roomId: to,
                                        userId: to,
                                        callerId: caller,
                                        isVideo,
                                        callData: dataCall
                                    });
                                    setTimeout(() => {
                                        this.isToVideoCall = false;
                                    }, 100);
                                }
                            });
                    }, 100);
                } else {
                    this.props.navigation.push("VideoCall", {
                        roomId: to,
                        userId: to,
                        callerId: caller,
                        isVideo,
                        callData: dataCall
                    });
                }
            }
        }

        if (prev.alertReducer !== alertReducer) {
            const { content } = alertReducer;
            if (content === I18n.t("Alert.unAuth")) {
                // this.onPress({ name: "Thoát" });
                this.unAuth();
            }
        }
    }

    unAuth() {
        const { dispatch, navigation } = this.props;
        dispatch({ type: "" });
        this.firebaseA = null;
        this.setState({ userRe: null, isRef: false });

        AsyncStorage.removeItem(Const.LOCAL_STORAGE.MISSED_CALLS_SEEN);
        setTimeout(() => {
            dispatch(removeContact());
            dispatch(logoutRequest());
        }, 200);
        navigation.navigate("LoginStack");
    }

    signOut() {
        const { userReducer, dispatch } = this.props;
        // const { unAuth } = this;
        const self = this;
        dispatch({ type: "REQUEST" });
        const paramsAlert = {
            content: I18n.t("Alert.signoutFailed"),
            title: I18n.t("Alert.notice"),
            type: Const.ALERT_TYPE.ERROR
        };

        userActions
            .updateNotificationId({
                id: userReducer.data.id,
                deviceToken: ""
            })
            .then(res => {
                if (res.error) {
                    dispatch(openAlert(paramsAlert));
                } else {
                    firebase
                        .database()
                        .ref("/status/")
                        .orderByChild("id")
                        .endAt(userReducer.data.id)
                        .limitToLast(1)
                        .once("value", childSnapshot => {
                            const message = childSnapshot.toJSON();
                            const key = Object.keys(message);
                            let value = message ? Object.values(message) : "";

                            if (!_.isEmpty(value)) {
                                let params = value[0];
                                params.platform = "";
                                params.voip = "";
                                firebase
                                    .database()
                                    .ref(`/status/${key}`)
                                    .update(params)
                                    .finally(() => {
                                        self.unAuth();
                                    });
                            } else {
                                self.unAuth();
                            }
                        });
                }
            })
            .catch(error => {
                dispatch(openAlert(paramsAlert));
            })
            .finally(() => {
                dispatch({ type: "" });
            });
    }

    onPress(item) {
        let { name, navigate, fireBase } = item;
        const { dispatch, navigation } = this.props;
        if (name === I18n.t("menu.exit")) {
            Alert.alert(
                I18n.t("Alert.confirm"),
                I18n.t("Alert.confirmLogout"),
                [
                    {
                        text: I18n.t("Alert.no"),
                        onPress: () => console.log("Cancel"),
                        style: "cancel"
                    },
                    { text: I18n.t("Alert.yes"), onPress: () => this.signOut() }
                ],
                { cancelable: false }
            );
        } else if (fireBase === "Menu_Share") {
            this.onShare();
        } else {
            const test = {
                drawer: "drawer"
            };
            navigation.navigate(navigate, { test });
            this.setState({
                id: name
            });
        }
    }

    renderRoutes(data) {
        return (
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                // contentContainerStyle={{ width: "100%", flex: 1 }}
                style={{
                    width: "100%",
                    height: "100%",
                    paddingHorizontal: PD.PADDING_1
                }}
                renderItem={({ item, index }) => this.renderItemRoutes(item)}
                // ItemSeparatorComponent = {this.FlatListItemSeparator}
            />
        );
    }

    CheckType(type) {
        switch (type) {
            case USER_TYPE.TEACHER:
                const routes = [
                    // {
                    //     name: I18n.t("menu.home"),
                    //     navigate: "MainTabContainerTeacher",
                    //     img: ICON.LIST_MENU,
                    //     fireBase: "Menu_Logout"
                    // },
                    {
                        name: I18n.t("menu.shareApp"),
                        navigate: "",
                        img: ICON.SHARE_MENU,
                        fireBase: "Menu_Share"
                    },
                    {
                        name: I18n.t("menu.feeList"),
                        navigate: "FeeList",
                        img: ICON.LIST_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.recharge"),
                        navigate: "TopupStack",
                        img: ICON.MONEY_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.incomeHistory"),
                        navigate: "IncomeHistory",
                        img: ICON.CLOCK_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.chart"),
                        navigate: "Charts",
                        img: ICON.CHART,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.scanQR"),
                        navigate: "QrScanStack",
                        img: ICON.CODE_QR_MENU,
                        fireBase: "Menu_Home"
                    },
                    {
                        name: I18n.t("menu.setting"),
                        navigate: "MainSetting",
                        img: ICON.SETTING_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.help"),
                        navigate: "FrequentQuestions",
                        img: ICON.HELP_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.exit"),
                        navigate: "ConfirmLogOut",
                        img: ICON.OUT_MENU,
                        fireBase: "Menu_Logout"
                    }
                ];
                return this.renderRoutes(routes);
            case USER_TYPE.STUDENT:
                const routes1 = [
                    // {
                    //     name: I18n.t("menu.home"),
                    //     navigate: "MainTabContainer",
                    //     img: ICON.LIST_MENU,
                    //     fireBase: "Menu_Logout"
                    // },
                    {
                        name: I18n.t("menu.shareApp"),
                        navigate: "",
                        img: ICON.SHARE_MENU,
                        fireBase: "Menu_Share"
                    },
                    {
                        name: I18n.t("menu.feeList"),
                        navigate: "FeeList",
                        img: ICON.LIST_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.recharge"),
                        navigate: "TopupStack",
                        img: ICON.MONEY_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.scanQR"),
                        navigate: "QrScanStack",
                        img: ICON.CODE_QR_MENU,
                        fireBase: "Menu_Home"
                    },
                    {
                        name: I18n.t("menu.setting"),
                        navigate: "MainSetting",
                        img: ICON.SETTING_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.help"),
                        navigate: "FrequentQuestions",
                        img: ICON.HELP_MENU,
                        fireBase: "Menu_Logout"
                    },
                    {
                        name: I18n.t("menu.exit"),
                        navigate: "ConfirmLogOut",
                        img: ICON.OUT_MENU,
                        fireBase: "Menu_Logout"
                    }
                ];
                return this.renderRoutes(routes1);
        }
    }

    navigate(type) {
        const { navigation } = this.props;
        switch (type) {
            case "MyQrCode":
                navigation.navigate(type);
                break;
            default:
                break;
        }
    }

    CheckTypeHeader(type) {
        switch (type) {
            case 1:
                return (
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => this.navigate("MyQrCode")}>
                        <AppImage local source={ICON.IC_QRCODE} style={{ width: 35, height: 35 }} />
                    </TouchableOpacity>
                );
            default:
                return <View style={{ flex: 1 }} />;
        }
    }

    onPressAvatar() {
        const { navigation, userReducer } = this.props;
        userReducer.data && userReducer.data.type
            ? navigation.navigate("TeacherDetails")
            : navigation.navigate("StudentDetails");
    }

    renderHeader() {
        const { userReducer, navigation } = this.props;
        let type = USER_TYPE.TEACHER;
        let amount = 0;
        let avatar = "";
        let first_name = "";
        let last_name = "";
        if (userReducer && userReducer.data) {
            type = userReducer.data.type;
            amount = userReducer.data.amount;
            avatar = userReducer.data.avatar;
            first_name = userReducer.data.user.first_name;
            last_name = userReducer.data.user.last_name;
        }
        return (
            <View
                style={{
                    flex: 6,
                    flexDirection: "row",
                    paddingHorizontal: PD.PADDING_4
                }}
            >
                {this.CheckTypeHeader(type)}
                <View style={{ flexDirection: "column" }}>
                    <TouchableOpacity onPress={() => this.onPressAvatar()} style={{ flex: 1, alignItems: "center" }}>
                        <AppImageCircle image resizeMode="cover" source={{ uri: avatar }} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <AppText
                            text={`${first_name} ${last_name}`}
                            style={{
                                color: "#fff",
                                fontSize: responsiveFontSize(3.0),
                                textAlign: "center"
                            }}
                        />
                        <AppText
                            text={`${I18n.t("menu.surplus")}: `}
                            style={{
                                color: "#fff",
                                fontSize: responsiveFontSize(2),
                                textAlign: "center",
                                lineHeight: responsiveFontSize(3)
                            }}
                        >
                            <AppText
                                text={`${numberToCurrency(amount)}${I18n.t("topUp.curr")}`}
                                style={{
                                    color: "#fff",
                                    fontSize: responsiveFontSize(2.5),
                                    textAlign: "center",
                                    lineHeight: responsiveFontSize(3)
                                }}
                            />
                        </AppText>
                        {type == 1 ? null : (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate("MyQrCode")}
                                style={{
                                    marginVertical: PD.PADDING_3,
                                    alignItems: "center",
                                    flex: 1
                                }}
                            >
                                <AppImage local source={ICON.QRCODE_STUDENT} style={{ width: 40, height: 40 }} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <TouchableOpacity style={{ flex: 1, alignItems: "flex-end" }} onPress={() => this.onPressAvatar()}>
                    <AppImage local source={ICON.EDIT} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
            </View>
        );
        // }
    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    "Yo-leaner:\nGoogle Play: https://play.google.com/store/apps/details?id=com.yotalk \nApp Store: https://apps.apple.com/app/id1479662460"
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    render() {
        const { userReducer } = this.props;
        // const { type } = userReducer.data;
        let type = USER_TYPE.TEACHER;
        if (userReducer && userReducer.data) {
            type = userReducer.data.type;
        }
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.BACKGROUND_MENU,
                    paddingTop: DIMENSION.STATUS_BAR_HEIGHT * 2
                }}
            >
                {this.renderHeader()}
                <View
                    style={{
                        backgroundColor: "#27303f",
                        height: 2,
                        borderBottomColor: "#3f4c63",
                        borderBottomWidth: 2,
                        marginBottom: PD.PADDING_2
                    }}
                />
                <View style={{ height: "50%" }}>{this.CheckType(type)}</View>
                {/* {Platform.OS === "ios" && <VoipCallios {...this.props} />} */}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        alertReducer: state.alertReducer,
        navigateReducer: state.navigateReducer,
        settingReducer: state.settingReducer
    };
}

Drawer = connect(mapStateToProps)(Drawer);
export default Drawer;
