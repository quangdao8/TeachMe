import React from "react";
import { connect } from "react-redux";
import {
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Share,
    Alert,
    Platform,
    Linking,
    FlatList,
    ScrollView
} from "react-native";
import { HeaderImage, AppText, AppSlider, AppImage, Container } from "components";
import { Icon, Spinner } from "native-base";
import { Images, ICON } from "assets";
import { Colors, ServiceHandle } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
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
const _ = require("lodash");
import firebase from "@react-native-firebase/app";
import "moment/locale/vi";

var months = ["March", "Jan", "Feb", "Dec"];

const moment = require("moment");
class DetailSearch extends React.Component {
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
            id: "",
            value: 0,
            lastOnline: ""
        };
        this.like = false;
    }

    componentWillMount() {
        const { userReducer, contactReducer } = this.props;
        // const array = userReducer.dataSearch.results;
        const { response } = contactReducer.data;
        const contact = this.props.navigation.getParam("contact");
        const { id } = contact;
        const index = _.findIndex(response, obj => {
            return obj.about_user.id == id;
        });
        if (index > -1) {
            this.setState({ is_like: false });
        } else {
            this.setState({ is_like: true });
        }

        this.getLastOnline(id);
    }

    componentDidUpdate(prevProps) {
        const { contactReducer, navigation, dispatch } = this.props;
        if (prevProps.contactReducer !== contactReducer) {
            this.setState({ press: false });
            if (contactReducer.type === types.ADD_FAILED) {
                setTimeout(() => {}, 200);
                return;
            }
            if (contactReducer.type === types.ADD_SUCCESS) {
                setTimeout(() => {
                    const paramsAlert = {
                        content: I18n.t("Alert.addContactSuccess"),
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.SUCCESS
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                }, 200);
                navigation.navigate("ListTeacher");
                setTimeout(() => {
                    this.getContact();
                }, 1000);
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

    getContact() {
        const { dispatch, userReducer } = this.props;
        let params = {
            of_user__id: userReducer.data.id
        };
        dispatch(getContactRequest(params));
        dispatch(sendFavoriteRequest(params));
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

    async onPressChat() {
        this.setState({ spinner: true });
        const user = this.props.navigation.getParam("contact");
        const { userReducer, dispatch } = this.props;
        let last_message_time = moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
        let params = { user_ids: [userReducer.data.id, user.id], last_message_time };
        let data = await chatHistoriesAction.createdGroupChat(params);

        if (!data.error) {
            this.setState({ spinner: false }, () => {
                const { navigation } = this.props;
                let groupName = this.state.text;
                let avatar = _.isEmpty(user.avatar) ? user.avatar : user.avatar;
                let id = data.response.chat_room.id;
                navigation.navigate("Chat", { id, chatRoomInfo: data.response, groupName, avatar });
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

    renderItem(img, title, text) {
        return (
            <View style={{ flexDirection: "row", width: "100%", marginTop: PD.PADDING_1 }}>
                <View style={styles.itemWrap}>
                    <AppImage
                        source={img}
                        style={{
                            height: DEVICE.DEVICE_WIDTH * 0.065,
                            width: DEVICE.DEVICE_WIDTH * 0.065
                        }}
                        resizeMode="contain"
                        local
                    />
                    <View style={styles.titleItemWrap}>
                        <AppText text={title} style={styles.titleItemTxt} />
                    </View>
                </View>
                <View style={styles.itemCard}>
                    {_.isString(text) ? (
                        <View style={{ justifyContent: "center" }}>
                            <AppText
                                text={text ? text : I18n.t("teacherScreen.noInfo")}
                                style={{
                                    color: Colors.BLACK_TEXT_COLOR,
                                    fontSize: responsiveFontSize(2.25),
                                    lineHeight: responsiveFontSize(2.8)
                                }}
                            />
                        </View>
                    ) : (
                        !_.isEmpty(text) &&
                        text.map((item, index) => (
                            <AppText
                                key={index}
                                text={item.specialize_topic_name}
                                style={{
                                    color: Colors.BLACK_TEXT_COLOR,
                                    fontSize: responsiveFontSize(2.25),
                                    lineHeight: responsiveFontSize(2.8)
                                }}
                            />
                        ))
                    )}
                </View>
            </View>
        );
    }
    goBack() {
        const { navigation } = this.props;
        navigation.goBack();
    }

    getContact() {
        const { dispatch, userReducer } = this.props;
        let params = {
            of_user__id: userReducer.data.id
        };
        dispatch(getContactRequest(params));
        dispatch(sendFavoriteRequest(params));
    }

    AddTeacher() {
        const contact = this.props.navigation.getParam("contact");
        const { dispatch, userReducer } = this.props;
        const { avatar, id } = contact;
        const param = {
            about_user_id: id,
            nickname: contact.user.first_name + " " + contact.user.last_name,
            avatar: avatar
        };
        const params = {
            param,
            userId: userReducer.data.id
        };
        dispatch(addRequest(params));
    }

    renderHeader() {
        const { navigation, userReducer } = this.props;
        const { lastOnline } = this.state;
        const user = navigation.getParam("contact");
        const { phone_number, avatar } = user;
        const { is_like } = this.state;
        const res = phone_number.substring(1, 20);
        const realName = user.user.first_name + " " + user.user.last_name;
        const nickname = user.user.first_name + " " + user.user.last_name;
        let time = lastOnline
            ? "Online " +
              moment(lastOnline)
                  .local()
                  .fromNow()
            : "Online";
        return (
            <HeaderImage
                // twoButton
                threeButton
                bgSource={{ uri: avatar }}
                avatarSource={{ uri: avatar }}
                title="Chi tiết giáo viên"
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
                        <AppText
                            text={realName}
                            style={{
                                color: Colors.WHITE_COLOR,
                                fontSize: responsiveFontSize(2.75),
                                textAlign: "center",
                                fontWeight: "bold"
                            }}
                        />
                        <AppText
                            text={`(${realName})`}
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
                onLeftPress={() => alert("pressleftttttt")}
                onLBtnPress={() =>
                    navigation.navigate("Share", {
                        contact: { about_user: user, nickname, avatar }
                    })
                }
                renderLeftbtn={<Icon name="sharealt" type="AntDesign" style={{ color: Colors.WHITE_COLOR }} />}
                onRBtnPress={() => this.AddTeacher()}
                renderRightbtn={
                    is_like ? (
                        <Icon name="heart-o" type="FontAwesome" style={{ color: Colors.WHITE_COLOR }} />
                    ) : (
                        <Icon name="heart" type="FontAwesome" style={{ color: Colors.RED_COLOR }} />
                    )
                }
                onRBtnPress={() => alert("nút yêu thích")}
                LBtmPress={() => {
                    navigation.navigate("Call", {
                        item: {
                            avatar: avatar,
                            nickname: nickname,
                            calledId: user.id,
                            of_user: userReducer.data.id,
                            isVideo: false,
                            consultant_fee: user.consultant_fee,
                            notificationId: user.notificationId,
                            friendType: user.type
                        }
                    });
                }}
                CBtmPress={() => {
                    navigation.navigate("Call", {
                        item: {
                            avatar: avatar,
                            nickname: nickname,
                            calledId: user.id,
                            of_user: userReducer.data.id,
                            isVideo: true,
                            consultant_fee: user.consultant_fee,
                            notificationId: user.notificationId,
                            friendType: user.type
                        }
                    });
                }}
                RBtmPress={() => {
                    this.onPressChat();
                }}
                IconLBtnRender={
                    <Image resizeMode="cover" source={ICON.PHONE_WHITE} style={{ height: 25, width: 25 }} />
                }
                IconCBtnRender={<Icon name="video-camera" type="FontAwesome" style={{ color: Colors.WHITE_COLOR }} />}
                IconRBtnRender={<Image resizeMode="cover" source={ICON.MESSAGE} style={{ height: 25, width: 25 }} />}
            />
        );
    }

    renderContent() {
        const contact = this.props.navigation.getParam("contact");
        let { job_position, profile_desciption, address, school, consultant_fee, point } = contact;
        point = _.isUndefined(point) ? 0 : point;
        const dataSubject = _.isEmpty(contact.specialize)
            ? []
            : contact.specialize.length
            ? contact.specialize
            : Object.values(contact.specialize);
        return (
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: Colors.SKY_BLUE,
                    paddingTop: PD.PADDING_5,
                    paddingHorizontal: DEVICE.DEVICE_WIDTH * 0.1,
                    paddingBottom: 60
                }}
            >
                {this.renderItem(ICON.SUBJECT, "Chuyên Môn: ", _.isEmpty(dataSubject) ? [] : dataSubject)}
                {this.renderItem(ICON.JOB, "Chức vụ: ", _.isEmpty(job_position) ? "" : job_position.name)}
                {this.renderItem(ICON.SCHOOL, "Trường: ", school)}
                {this.renderItem(ICON.LOCATION, "Địa chỉ: ", address)}
                <View style={{ height: 30, width: "100%", marginTop: PD.PADDING_2 }}>
                    <AppSlider value={point} disabled={true} onSlidingComplete={value => this.setState({ value })} />
                </View>
                <AppText text={`(`} style={styles.reviewPointGray}>
                    <AppText text={`Điểm đánh giá :`} style={styles.reviewPointGray} />
                    <AppText text={` ${Math.ceil(point)}/100`} style={styles.reviewPoint} />
                    <AppText text={`)`} style={styles.reviewPointGray} />
                </AppText>
                {consultant_fee == null ? (
                    <AppText
                        text="Phí tư vấn : 0/phút)"
                        style={{
                            marginTop: 10,
                            fontSize: responsiveFontSize(3),
                            alignSelf: "center",
                            fontWeight: "bold"
                        }}
                    />
                ) : (
                    <AppText
                        text={`(Phí tư vấn : ${consultant_fee}/phút)`}
                        style={{
                            marginTop: 10,
                            fontSize: responsiveFontSize(3),
                            alignSelf: "center",
                            fontWeight: "bold"
                        }}
                    />
                )}
                <AppText
                    text={profile_desciption}
                    style={{
                        marginTop: 10,
                        fontSize: responsiveFontSize(2.5),
                        color: Colors.GRAY_TEXT_COLOR,
                        width: "100%"
                    }}
                />
            </ScrollView>
        );
    }

    render() {
        return (
            <View style={{ backgroundColor: Colors.SKY_BLUE, flex: 1 }}>
                {this.spiner()}
                {this.renderHeader()}
                {this.renderContent()}
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
        contactReducer: state.contactReducer
    };
}
DetailSearch = connect(mapStateToProps)(DetailSearch);
export default DetailSearch;
