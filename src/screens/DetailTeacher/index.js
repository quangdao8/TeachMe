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
import { HeaderImage, AppText, AppSlider, AppImage, Container } from "../../components";
import { Icon, Spinner } from "native-base";
import { Images, ICON, FONT_SF } from "assets";
import { Colors, ServiceHandle } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { PD, DEVICE, DIMENSION, USER_TYPE } from "helper/Consts";
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
} from "../../actions/contactActions";
import {
    getFavoriteTeacherRequest,
    sendFavoriteTeacherRequest,
    deleteFavoriteTeacherRequest,
    getListFavoriteTeacherRequest
} from "actions/favoriteAction";
import { getUserData } from "actions/userActions";
import I18n from "helper/locales";
import styles from "./styles";
const _ = require("lodash");
import firebase from "@react-native-firebase/app";
import "moment/locale/vi";
// import "moment/locale/en-au";
import { Rating, AirbnbRating } from "react-native-elements";
import { StackActions } from "react-navigation";
import { onNavigate } from "actions/navigateAction";
import { numberToCurrency } from "helper/convertLang";
var months = ["March", "Jan", "Feb", "Dec"];

const moment = require("moment");
class DetailTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oneBtn: false,
            value: 0,
            is_like: false,
            text: "",
            edit: false,
            spinner: true,
            dele: false,
            disabled: false,
            id: "",
            datagetUser: { point: 0 },
            loading: false,
            lastOnline: "",
            dataLike: {
                teacher: {
                    id: -1,
                    avatar: "",
                    user: {
                        first_name: "",
                        last_name: ""
                    }
                }
            },
            consultantFee: ""
        };
        this.like = false;
    }

    async componentDidMount() {
        const contact = this.props.navigation.getParam("contact");
        const { favoriteReducer, dispatch, tNsReducer } = this.props;
        const default_Fee = tNsReducer?.dataMasterSetting?.results[0]?.block_value_teacher ?? 0;
        dispatch(getFavoriteTeacherRequest(contact.teacher.id));
        this.setState({
            id: contact.teacher.id,
            is_like: _.isEmpty(favoriteReducer.dataFavoriteTeacher)
                ? false
                : favoriteReducer.dataFavoriteTeacher.is_liked
        });

        getUserData({ id: contact.teacher.id }).then(res => {
            if (!res.error) {
                this.setState({
                    datagetUser: res.response,
                    spinner: false
                });
                this.getLastOnline(res.response.id);
            } else {
                this.setState({ spinner: false });
            }
        });

        let getConsultantFee = await ServiceHandle.get(`/consultant_fee/?user_id=${contact.teacher.id}&active=1`);
        if (getConsultantFee.response[0]) {
            if (getConsultantFee.response[0].consultant_fee <= default_Fee) {
                this.setState({
                    consultantFee: default_Fee
                });
            } else {
                this.setState({
                    consultantFee: getConsultantFee.response[0].consultant_fee
                });
            }
        } else {
            this.setState({ consultantFee: default_Fee });
        }
    }

    onLoading() {
        const { dispatch, userReducer } = this.props;

        let params = {
            user__id: userReducer.data.id,
            is_liked: true
        };
        dispatch(getListFavoriteTeacherRequest(params));
    }

    componentDidUpdate(prevProps) {
        const { favoriteReducer, dispatch } = this.props;
        const contact = this.props.navigation.getParam("contact");
        console.log('+++++++++++++++++', favoriteReducer);
        if (prevProps.favoriteReducer !== favoriteReducer) {
            if (favoriteReducer.type == types.GET_FAVORITE_TEACHER_SUCCESS) {
                this.setState({
                    id: contact.teacher.id,
                    is_like: favoriteReducer.dataFavoriteTeacher.is_liked,
                    dataLike: favoriteReducer.dataFavoriteTeacher
                });
            }
            if (
                favoriteReducer.type == types.POST_FAVORITE_TEACHER_SUCCESS ||
                favoriteReducer.type == types.DELETE_FAVORITE_TEACHER_SUCCESS
            ) {
                this.onLoading();
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
                <Spinner color="white" />
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
            user_ids: [userReducer.data.id, user.teacher.id],
            last_message_time
        };
        let data = await chatHistoriesAction.createdGroupChat(params);

        if (!data.error) {
            this.setState({ spinner: false }, () => {
                const { navigation } = this.props;
                let groupName = this.state.text;
                let avatar = _.isEmpty(user.avatar) ? user.teacher.avatar : user.avatar;
                let id = data.response.chat_room.id;
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

    message() {
        const contact = this.props.navigation.getParam("contact");
        const { phone_number } = contact.teacher;
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
    }

    callNumber = phone_number => {
        // const contact = this.props.navigation.getParam("contact");
        // const { phone_number } = contact.teacher;
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
                                text={text}
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
        const { dispatch, userReducer, navigation } = this.props;
        navigation.goBack();
        let params = {
            of_user__id: userReducer.data.id
        };
        let params1 = {
            user__id: userReducer.data.id,
            is_liked: true
        };
        dispatch(getContactRequest(params));
        dispatch(getListFavoriteTeacherRequest(params1));
    }

    getContact() {
        const { dispatch, userReducer } = this.props;
        let params = {
            of_user__id: userReducer.data.id
        };
        dispatch(getContactRequest(params));
        dispatch(sendFavoriteRequest(params));
    }

    addTeacher() {
        Alert.alert(
            I18n.t("detailTeacher.addTeacher"),
            I18n.t("detailTeacher.confirmAddTeacher"),
            [
                { text: "Cancel", onPress: () => console.log("Ask me later pressed") },
                // {
                //     text: "Cancel",
                //     onPress: () => console.log("Cancel Pressed"),
                //     style: "cancel"
                // },
                { text: "OK", onPress: () => this.onLike() }
            ],
            { cancelable: false }
        );
    }
    remove() {
        Alert.alert(
            I18n.t("detailTeacher.unLikeTeacher"),
            I18n.t("detailTeacher.confirmUnLikeTeacher"),
            [
                { text: "Cancel", onPress: () => console.log("Ask me later pressed") },
                // {
                //     text: "Cancel",
                //     onPress: () => console.log("Cancel Pressed"),
                //     style: "cancel"
                // },
                { text: "OK", onPress: () => this.disLike() }
            ],
            { cancelable: false }
        );
    }

    onLike() {
        const { is_like } = this.state;
        const { userReducer, favoriteReducer } = this.props;
        // const contact = favoriteReducer?.dataFavoriteTeacher;
        const contact = this.props.navigation.getParam("contact");
        this.setState({ is_like: !is_like });
        console.log('contact---',userReducer);
        const params = {
            teacher_id: contact?.teacher.id,
            user_id: userReducer.data.id
        };
        this.props.dispatch(sendFavoriteTeacherRequest(params));
    }
    async disLike() {
        const { is_like } = this.state;
        const contact = this.props.favoriteReducer.dataFavoriteTeacher;
        console.log('+++++++++++++++++++++++', contact);
        this.setState({ is_like: !is_like });
        // const data = await ServiceHandle.delete(`favorite_teacher/${contact?.teacher.id}/`);
        // if (data.error == false) {
        //     this.onLoading();
        // }
        this.delete(contact.teacher.id);
        this.props.dispatch(deleteFavoriteTeacherRequest(contact.teacher.id));
    }
    delete(params) {
        const { dispatch, userReducer } = this.props;
        const { auth_token } = userReducer.data;
        const url = "https://112.213.94.138/yo/api/favorite_teacher/" + params + "/";
        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${auth_token}`
            }
        })
            .then(res => console.log("res", res))
            .catch(err => console.log("err", err));
    }
    addFriend() {
        Alert.alert(
            I18n.t("Alert.notice"),
            I18n.t("detailTeacher.askToAddFriend"),
            [
                { text: I18n.t("Alert.cancel"), style: "cancel", onPress: () => {} },
                { text: "OK", onPress: () => this.addFriendFunction() }
            ],
            { cancelable: true }
        );
    }
    addFriendFunction() {
        const contact = this.state.dataLike.teacher;
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

    onRBtnPress(is_like) {
        const { userReducer } = this.props;
        const isTeacher = userReducer.data.type === USER_TYPE.TEACHER;
        if (isTeacher) {
            // this.addFriend();
            console.log('isTeacher',isTeacher);
        } else {
            if (is_like) {
                console.log('222');
                this.remove();
            } else {
                console.log('333');
                this.addTeacher();
            }
        }
    }

    renderHeader() {
        const { lastOnline, is_like, dataLike } = this.state;
        const { navigation, userReducer, dispatch } = this.props;
        // const contact = dataLike;
        const contact = this.props.navigation.getParam("contact");
        const { id, avatar } = contact.teacher;
        const realName = contact.teacher.user.first_name + " " + contact.teacher.user.last_name;
        let time = lastOnline
            ? "Online " +
              moment(lastOnline)
                  .local()
                  .fromNow()
            : "Online";
        const isTeacher = userReducer.data.type === USER_TYPE.TEACHER;
        const isSub = userReducer.data.is_sub || isTeacher;

        return (
            <HeaderImage
                threeButton
                bgSource={{ uri: avatar }}
                avatarSource={{ uri: avatar }}
                title={I18n.t("detailTeacher.title")}
                nameStyle={{ fontSize: responsiveFontSize(3) }}
                onBackPress={() => navigation.goBack()}
                infoContent={
                    <View
                        style={{
                            flex: 1,
                            marginBottom: DIMENSION.BUTTON_HEIGHT / 2
                        }}
                    >
                        <AppText text={realName} style={styles.realNameTxt} />
                        <AppText text={time} style={styles.onlineTimeTxt} />
                    </View>
                }
                onLeftPress={() => {}}
                onLBtnPress={() =>
                    isSub ? navigation.navigate("Share", { contact: contact }) : dispatch(alertActions.openModal())
                }
                disabledL={id ? false : true}
                disabledR={false}
                renderLeftbtn={<Icon name="sharealt" type="AntDesign" style={{ color: Colors.WHITE_COLOR }} />}
                renderRightbtn={
                    isTeacher ? (
                        <AppImage local resizeMode="cover" source={ICON.ADD_IC} style={{ height: 25, width: 25 }} />
                    ) : is_like ? (
                        <Icon name="heart" type="FontAwesome" style={{ color: Colors.RED_COLOR }} />
                    ) : (
                        <Icon name="heart-o" type="FontAwesome" style={{ color: Colors.WHITE_COLOR }} />
                    )
                }
                onRBtnPress={() => this.onRBtnPress(is_like)}
                LBtmPress={() => {
                    if (!isSub) {
                        dispatch(alertActions.openModal());
                        return;
                    }
                    navigation.navigate("Call", {
                        item: {
                            avatar: contact.teacher.avatar,
                            nickname: contact.teacher.name,
                            calledId: contact.id,
                            of_user: userReducer.data.id,
                            isVideo: false,
                            from: "detail teacher",
                            consultant_fee: contact.teacher.consultant_fee,
                            notificationId: contact.teacher.notificationId,
                            friendType: contact.teacher.type
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
                            avatar: contact.teacher.avatar,
                            nickname: contact.teacher.name,
                            calledId: id,
                            of_user: userReducer.data.id,
                            isVideo: true,
                            from: "detail teacher",
                            consultant_fee: contact.teacher.consultant_fee,
                            notificationId: contact.teacher.notificationId,
                            friendType: contact.teacher.type
                        }
                    });
                }}
                RBtmPress={() => {
                    if (!isSub) {
                        dispatch(alertActions.openModal());
                        return;
                    }
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
    ratingCompleted(rating) {
        console.log("Rating is: " + rating);
    }
    renderContent() {
        const { datagetUser, consultantFee } = this.state;
        const contact = this.props.navigation.getParam("contact");
        const { job_position, profile_desciption, address, school, consultant_fee, city } = contact.teacher;
        const dataSubject = _.isEmpty(contact.teacher.specialize)
            ? []
            : contact.teacher.specialize.length
            ? contact.teacher.specialize
            : Object.values(contact.teacher.specialize);
        return (
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: Colors.SKY_BLUE,
                    paddingTop: PD.PADDING_5,
                    paddingHorizontal: DEVICE.DEVICE_WIDTH * 0.1,
                    paddingBottom: 60
                }}
                showsVerticalScrollIndicator={false}
            >
                {this.renderItem(
                    ICON.SUBJECT,
                    I18n.t("detailTeacher.subject"),
                    _.isEmpty(dataSubject) ? I18n.t("teacherScreen.noInfo") : dataSubject
                )}
                {this.renderItem(
                    ICON.JOB,
                    I18n.t("detailTeacher.jobPosition"),
                    _.isEmpty(job_position) ? I18n.t("teacherScreen.noInfo") : job_position.name
                )}
                {this.renderItem(
                    ICON.SCHOOL,
                    I18n.t("detailTeacher.school"),
                    _.isEmpty(school) ? I18n.t("teacherScreen.noInfo") : school.name
                )}
                {this.renderItem(
                    ICON.LOCATION,
                    I18n.t("detailTeacher.address"),
                    address ? address : I18n.t("teacherScreen.noInfo")
                )}
                <View style={{ height: 30, width: "100%", marginTop: PD.PADDING_2 }}>
                    {/* <AppSlider value={datagetUser.point} disabled={true} /> */}

                    <Rating
                        readonly={true}
                        fractions={1}
                        ratingImage={ICON.IC_STAR_RATING}
                        type="custom"
                        ratingBackgroundColor={Colors.CONTENT_COLOR}
                        onFinishRating={this.ratingCompleted}
                        startingValue={datagetUser.point / 20}
                    />
                </View>
                <AppText text={`(`} style={styles.reviewPointGray}>
                    <AppText text={I18n.t("detailTeacher.point")} style={styles.reviewPointGray} />
                    <AppText text={` ${(datagetUser.point / 20).toFixed(1)}/5`} style={styles.reviewPoint} />
                    <AppText text={`)`} style={styles.reviewPointGray} />
                </AppText>

                <AppText
                    text={`${I18n.t("detailTeacher.consultantFee")} ${numberToCurrency(consultantFee)} ${I18n.t(
                        "detailTeacher.min"
                    )}`}
                    style={styles.consultantFeeTxt}
                />

                <AppText text={profile_desciption} style={styles.descriptionTxt} />
            </ScrollView>
        );
    }

    render() {
        const { userReducer } = this.props;
        return (
            <View
                style={{
                    backgroundColor: Colors.SKY_BLUE,
                    flex: 1,
                    opacity: userReducer.data.is_sub || userReducer.data.type === USER_TYPE.TEACHER ? 1 : 0.5
                }}
            >
                {/* {this.spiner()} */}
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
        contactReducer: state.contactReducer,
        favoriteReducer: state.favoriteReducer,
        tNsReducer: state.tNsReducer,
    };
}
DetailTeacher = connect(mapStateToProps)(DetailTeacher);
export default DetailTeacher;
