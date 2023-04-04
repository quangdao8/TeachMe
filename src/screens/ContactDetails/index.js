import React from "react";
import { connect } from "react-redux";
import { View, Image, TextInput, TouchableOpacity, Share, Alert, Platform, Linking } from "react-native";
import { HeaderImage, AppText } from "components";
import { Icon, Spinner } from "native-base";
import { Images, ICON } from "assets";
import { Colors, ServiceHandle } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { PD, DEVICE, DIMENSION, GROUP_TYPE, USER_TYPE } from "helper/Consts";
import { chatHistoriesAction, alertActions } from "actions";
import { Const } from "helper/index";
import { types } from "actions";
import {
    SendContactRequest,
    DeleteContactRequest,
    getContactRequest,
    sendFavoriteRequest,
    editContactLocal,
    detailsContacntRequest,
    addRequest
} from "actions/contactActions";
import I18n from "helper/locales";
import styles from "./styles";
import firebase from "@react-native-firebase/app";
import "moment/locale/vi";
import { StackActions, NavigationActions } from "react-navigation";
import { onNavigate } from "actions/navigateAction";

const _ = require("lodash");

const moment = require("moment");

class ContactDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oneBtn: false,
            value: 0,
            is_like: "",
            text: "",
            edit: false,
            spinner: false,
            dele: false,
            disabled: false,

            realName: "",
            lastOnline: ""
            // user=  this.props.navigation.getParam("contact")
        };
        this.like = false;
    }

    componentWillMount() {
        const contact = this.props.navigation.getParam("contact");
        // this.setState({ is_like: contact.is_like });
        const { dispatch, navigation, contactReducer } = this.props;
        if (!contact.id) {
            this.setState({ text: contact.nickname });
        } else {
            dispatch(detailsContacntRequest(contact.id));
        }

        this.getLastOnline(contact.about_user.id);
    }

    componentDidUpdate(prevProps) {
        const { contactReducer, navigation, dispatch, chatRoomInfoProps } = this.props;
        const contact = navigation.getParam("contact");
        if (prevProps.contactReducer !== contactReducer) {
            const { dataDetail } = contactReducer;
            if (!_.isNull(dataDetail)) {
                const { response } = dataDetail;
                const { user } = response.about_user;
                if (!this.like) {
                    this.like = true;
                    if (!contact.id) {
                        this.setState({
                            text: contact.nickname,
                            is_like: contact.is_like,
                            id: "",
                            realName: ""
                        });
                    } else {
                        this.setState({
                            text: response.nickname,
                            is_like: response.is_like,
                            id: response.id,
                            realName: user.first_name + " " + user.last_name
                        });
                    }
                }
            }
            if (contactReducer.type === types.ADD_FAILED) {
                setTimeout(() => {}, 200);
                return;
            }
            if (contactReducer.type === types.ADD_SUCCESS) {
                const paramsAlert = {
                    content: I18n.t("Alert.addContactSuccess"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.SUCCESS
                };
                dispatch(alertActions.openAlert(paramsAlert));
                setTimeout(() => {
                    const id = chatRoomInfoProps.id;
                    dispatch(chatHistoriesAction.chatRoomCurrentRequest({ id }));
                    navigation.goBack();
                }, 200);

                return;
            }
        }
    }

    getLastOnline(id) {
        firebase
            .database()
            .ref(`/status/`)
            .orderByChild("id")
            .endAt(id)
            .limitToLast(1)
            .once("value", childSnapshot => {
                let lastOnline = "";
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                if (value && value[0].onlineStatusTime && !value[0].status && value[0].id == id) {
                    lastOnline = value[0].onlineStatusTime;
                } else {
                    lastOnline = "";
                }
                this.setState({
                    lastOnline
                });
            });
    }

    onShare = async () => {
        const contact = this.props.navigation.getParam("contact");
        const { nickname } = contact;
        const { phone_number } = contact.about_user;
        this.setState({ disabled: true });
        setTimeout(() => {
            this.setState({ disabled: false });
        }, 500);
        try {
            const result = await Share.share({
                message: `${`name:`} ${nickname} ${`,  `}${`phone:`} ${phone_number} `
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            alert(error.message);
        }
    };

    onLike(isLike) {
        this.setState({ is_like: !isLike }, () => {
            const { contactReducer } = this.props;
            const { id } = contactReducer.dataDetail.response;
            const params = {
                id,
                is_like: !isLike
            };
            const url = "contact/" + id + "/";
            const response = ServiceHandle.patch(url, params);
            setTimeout(() => {
                this.getContact();
            }, 1000);
        });
    }

    likeStudent(is_like) {
        if (is_like) {
            Alert.alert(
                I18n.t("Alert.unLikeStudent"),
                I18n.t("Alert.confirmUnLikeStudent"),
                [
                    { text: "Cancel", onPress: () => console.log("Ask me later pressed") },
                    // {
                    //     text: "Cancel",
                    //     onPress: () => console.log("Cancel Pressed"),
                    //     style: "cancel"
                    // },
                    { text: "OK", onPress: () => this.onLike(is_like) }
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert(
                I18n.t("Alert.likeStudent"),
                I18n.t("Alert.confirmLikeStudent"),
                [
                    { text: "Cancel", onPress: () => console.log("Ask me later pressed") },
                    // {
                    //     text: "Cancel",
                    //     onPress: () => console.log("Cancel Pressed"),
                    //     style: "cancel"
                    // },
                    { text: "OK", onPress: () => this.onLike(is_like) }
                ],
                { cancelable: false }
            );
        }
    }
    onEdit() {
        const { edit, text, id } = this.state;
        const { dispatch, navigation, contactReducer, userReducer, chatRoomInfoProps } = this.props;
        const contact = navigation.getParam("contact");
        const fromScreen = navigation.getParam("screen");
        let params = { ...contact };
        params.nickname = text;
        this.setState({ edit: !edit }, () => {
            if (edit === true) {
                if (text.trim() == "") {
                    const paramsAlert = {
                        content: I18n.t("Alert.nameBlank"),
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.WARNING
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                } else if (_.isUndefined(fromScreen)) {
                    dispatch(editContactLocal(params));
                    setTimeout(() => {
                        dispatch(SendContactRequest(params));
                    }, 500);
                } else {
                    const id = chatRoomInfoProps.id;
                    dispatch(editContactLocal(params));
                    setTimeout(() => {
                        dispatch(SendContactRequest(params));
                        dispatch(chatHistoriesAction.chatRoomCurrentRequest({ id }));
                    }, 500);
                }
            } else {
            }
        });
    }

    onGo() {
        const { dispatch, navigation, userReducer, contactReducer } = this.props;
        const contact = navigation.getParam("contact");
        const { id } = contactReducer.dataDetail.response;
        dispatch(DeleteContactRequest(id));
        setTimeout(() => {
            this.getContact();
            navigation.goBack();
        }, 4000);
    }

    deleteContact() {
        const { dele } = this.state;
        this.setState({ dele: !dele });

        Alert.alert(
            I18n.t("Alert.confirm"),
            I18n.t("Alert.confirmDeleteContact"),
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.onGo() }
            ],
            { cancelable: false }
        );
    }

    spiner() {
        let { spinner } = this.state;
        return spinner ? (
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: DEVICE.DEVICE_HEIGHT,
                    width: DEVICE.DEVICE_WIDTH,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 3,
                    justifyContent: "center"
                }}
            >
                <Spinner color="#000000" />
            </View>
        ) : null;
    }

    dispatchNavigate(screen, roomId) {
        const { dispatch } = this.props;
        dispatch(onNavigate(screen, roomId));
    }

    async onPressChat() {
        this.setState({ spinner: true });
        const user = this.props.navigation.getParam("contact");
        const { userReducer, dispatch } = this.props;
        const fromScreen = this.props.navigation.getParam("screen");
        let last_message_time = moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
        let params = {
            user_ids: [userReducer.data.id, user.about_user.id],
            last_message_time,
            type: GROUP_TYPE.PRIVATE
        };
        let data = await chatHistoriesAction.createdGroupChat(params);

        if (!data.error) {
            this.setState({ spinner: false }, () => {
                const { navigation } = this.props;
                let groupName = this.state.text;
                let avatar = _.isEmpty(user.avatar) ? user.about_user.avatar : user.avatar;
                let id = data.response.chat_room.id;
                // dispatch(chatHistoriesAction.chatRoomCurrentRequest({ id }));
                if (!_.isUndefined(fromScreen)) {
                    this.props.navigation.dispatch(StackActions.popToTop());
                    this.dispatchNavigate("Chat", id);
                } else {
                    // setTimeout(() => {
                    navigation.navigate("Chat", {
                        id,
                        chatRoomInfo: data.response,
                        groupName,
                        avatar
                    });
                    // }, 200);
                }
            });
        } else {
            this.setState({ spinner: false });
            setTimeout(() => {
                const paramsAlert = {
                    content: I18n.t("Alert.createChatGroupError"),
                    // content: data.errorMessage,
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            }, 100);
        }
    }

    getContact() {
        const { dispatch, userReducer } = this.props;
        let params = {
            of_user__id: userReducer.data.id
        };
        dispatch(getContactRequest(params));
        dispatch(sendFavoriteRequest(params));
    }

    goBack() {
        const { navigation } = this.props;
        // dispatch(getContactRequest(params));
        // dispatch(sendFavoriteRequest(params));
        navigation.goBack();
    }

    // async onPressChat() {
    //     this.setState({ spinner: true });
    //     const user = this.props.navigation.getParam("contact");
    //     const { userReducer, dispatch } = this.props;
    //     let last_message_time = moment()
    //         .utc()
    //         .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    //     let params = {
    //         user_ids: [userReducer.data.id, user.about_user.id],
    //         last_message_time,
    //         type: GROUP_TYPE.PRIVATE
    //     };
    //     let data = await chatHistoriesAction.createdGroupChat(params);
    // }

    message() {
        const contact = this.props.navigation.getParam("contact");
        const { phone_number } = contact.about_user;
        let url = Platform.OS == "android" ? `sms:${phone_number}?body=` : `sms:${phone_number}`;
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    console.log("Unsupported url: " + url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(err => console.error("An error occurred", err));
        // Text( phone_number, (message = false), (autoEncode = true));
    }

    callNumber = phone_number => {
        // const contact = this.props.navigation.getParam("contact");
        // const { phone_number } = contact.about_user;
        let phoneNumber = phone_number;
        if (Platform.OS !== "android") {
            phoneNumber = `telprompt:${phone_number}`;
        } else {
            phoneNumber = `tel:${phone_number}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert("Phone number is not available");
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    };
    AddFriend() {
        const contact = this.props.navigation.getParam("contact");
        const { dispatch, userReducer } = this.props;
        const { avatar, id } = contact.about_user;

        const param = {
            about_user_id: id,
            nickname: contact.nickname,
            avatar: avatar
        };
        const params = {
            param,
            userId: userReducer.data.id
        };
        dispatch(addRequest(params));
    }
    render() {
        const { contactReducer, navigation, userReducer, dispatch } = this.props;
        const user = navigation.getParam("contact");
        let { edit, text, disabled, is_like, id, realName, lastOnline } = this.state;
        const { avatar, about_user } = user;
        const isSub =
            userReducer.data.type === USER_TYPE.TEACHER ||
            userReducer.data.is_sub ||
            about_user.type === USER_TYPE.STUDENT;
        // const { phone_number } = user.about_user;
        // const res = phone_number.substring(1, 20);
        const currentUser = contactReducer.data.response;
        const checkUser = _.findIndex(currentUser, function(o) {
            return o.about_user.id == user.about_user.id;
        });
        let time = lastOnline
            ? "Online " +
              moment(lastOnline)
                  .local()
                  .fromNow()
            : "Online";

        // const { is_like} = contactReducer.dataDetail.response;
        return (
            <View
                style={{
                    backgroundColor: Colors.SKY_BLUE,
                    opacity: isSub ? 1 : 0.5
                }}
            >
                {this.spiner()}
                <HeaderImage
                    // twoButton
                    threeButton
                    // right
                    bgSource={id ? { uri: avatar } : Images.DEFAULT_AVATAR}
                    avatarSource={id ? { uri: avatar } : Images.DEFAULT_AVATAR}
                    title={I18n.t("contactDetail.title")}
                    nameStyle={{ fontSize: responsiveFontSize(3) }}
                    onBackPress={() => this.goBack()}
                    infoContent={
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "space-evenly",
                                marginBottom: DIMENSION.BUTTON_HEIGHT / 2
                            }}
                        >
                            {edit ? (
                                <TextInput
                                    autoFocus={true}
                                    style={{
                                        fontSize: responsiveFontSize(2.75),
                                        color: Colors.WHITE_COLOR
                                    }}
                                    onChangeText={text => this.setState({ text })}
                                    value={text}
                                />
                            ) : (
                                <AppText
                                    text={text}
                                    style={{
                                        color: Colors.WHITE_COLOR,
                                        fontSize: responsiveFontSize(2.75),
                                        textAlign: "center",
                                        fontWeight: "bold"
                                    }}
                                />
                            )}

                            <AppText
                                text={realName && `(${realName})`}
                                style={{
                                    color: Colors.DIABLED_BUTTON,
                                    fontSize: responsiveFontSize(1.75),
                                    textAlign: "center"
                                }}
                            />

                            <AppText
                                text={time}
                                style={{
                                    color: Colors.DIABLED_BUTTON,
                                    fontSize: responsiveFontSize(1.75),
                                    textAlign: "center"
                                }}
                            />
                        </View>
                    }
                    onLeftPress={() => alert("pressleft")}
                    onLBtnPress={() => this.onEdit()}
                    disabledL={checkUser > -1 ? false : true}
                    // disabledR={user.about_user.type == 0 ? true : false}
                    renderLeftbtn={
                        edit ? (
                            <Icon name="save" type="AntDesign" style={{ color: "#d3dff2", fontSize: 30 }} />
                        ) : (
                            <Image resizeMode="cover" source={ICON.EDIT} style={{ height: 25, width: 25 }} />
                        )
                    }
                    renderRightbtn={
                        userReducer.data.type == USER_TYPE.TEACHER ? (
                            checkUser > -1 ? (
                                user.about_user.type == USER_TYPE.STUDENT &&
                                (is_like ? (
                                    <Icon name="heart" type="FontAwesome" style={{ color: Colors.RED_COLOR }} />
                                ) : (
                                    <Icon name="heart-o" type="FontAwesome" style={{ color: Colors.WHITE_COLOR }} />
                                ))
                            ) : (
                                <Image resizeMode="cover" source={ICON.ADD_IC} style={{ height: 25, width: 25 }} />
                            )
                        ) : (
                            checkUser == -1 && (
                                <Image resizeMode="cover" source={ICON.ADD_IC} style={{ height: 25, width: 25 }} />
                            )
                        )
                    }
                    onRBtnPress={() => (checkUser > -1 ? this.likeStudent(is_like) : this.AddFriend())}
                    disabledLBtm={checkUser > -1 ? false : true}
                    LBtmPress={() => {
                        if (!isSub) {
                            dispatch(alertActions.openModal());
                            return;
                        }
                        navigation.navigate("Call", {
                            item: {
                                avatar: avatar,
                                nickname: user.nickname,
                                calledId: user.about_user.id,
                                of_user: user.of_user,
                                isVideo: false,
                                from: "Contact detail",
                                consultant_fee: user.about_user.consultant_fee,
                                notificationId: user.about_user.notificationId,
                                friendType: user.about_user.type
                            }
                        });
                    }}
                    CBtmPress={() => {
                        if (!isSub) {
                            dispatch(alertActions.openModal());
                            return;
                        }
                        navigation.navigate("Call", {
                            item: {
                                avatar: avatar,
                                nickname: user.nickname,
                                calledId: user.about_user.id,
                                of_user: user.of_user,
                                isVideo: true,
                                from: "Contact detail",
                                consultant_fee: user.about_user.consultant_fee,
                                notificationId: user.about_user.notificationId,
                                friendType: user.about_user.type
                            }
                        });
                    }}
                    disabledC={checkUser > -1 ? false : true}
                    RBtmPress={() => {
                        if (!isSub) {
                            dispatch(alertActions.openModal());
                            return;
                        }
                        this.onPressChat();
                    }}
                    disabledRBtm={checkUser > -1 ? false : true}
                    IconLBtnRender={
                        <Image resizeMode="cover" source={ICON.PHONE_WHITE} style={{ height: 25, width: 25 }} />
                    }
                    IconCBtnRender={
                        <Icon name="video-camera" type="FontAwesome" style={{ color: Colors.WHITE_COLOR }} />
                    }
                    IconRBtnRender={
                        <Image resizeMode="cover" source={ICON.MESSAGE} style={{ height: 25, width: 25 }} />
                    }
                />
                <View
                    style={{
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                        backgroundColor: Colors.SKY_BLUE
                    }}
                >
                    <TouchableOpacity disabled={disabled} style={styles.btnShare} onPress={() => this.onShare()}>
                        <Image resizeMode="contain" source={ICON.SHARE} style={styles.iconStyle} />
                        <AppText text={I18n.t("contactDetail.shareNumber")} style={styles.textShare} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnDelete}
                        disabled={id ? false : true}
                        onPress={() => this.deleteContact()}
                    >
                        <Image resizeMode="contain" source={ICON.RECYCLE} style={styles.iconStyle} />
                        <AppText
                            text={I18n.t("contactDetail.deleteNumber")}
                            style={[styles.textDelete, { color: id == null ? "#636363" : "#000" }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        sendContactReducer: state.sendContactReducer,
        deteleContactReducer: state.deteleContactReducer,
        sendLikeReducer: state.sendLikeReducer,
        contactReducer: state.contactReducer,
        chatRoomInfoProps: state.chatHistoriesReducer.currentRoom
    };
}
ContactDetails = connect(mapStateToProps)(ContactDetails);
export default ContactDetails;
