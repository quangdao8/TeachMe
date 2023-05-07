import React from "react";
import { connect } from "react-redux";
import { View, Image, FlatList, Platform, ScrollView, AsyncStorage, ActivityIndicator } from "react-native";
import { HeaderImage, AppText, Button } from "components";
import { ICON } from "assets";
import { Colors } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { DEVICE, GROUP_TYPE } from "helper/Consts";
import { Const } from "helper/index";
import I18n from "helper/locales";
import CardAvatar from "./Component/CardAvatar";
import styles from "./styles";
import { callDetailsRequest } from "actions/callActions";
import { chatHistoriesAction, alertActions, types, userActions } from "actions";
import { Icon, Spinner } from "native-base";
import firebase from "@react-native-firebase/app";
import "moment/locale/vi";
const moment = require("moment");
const _ = require("lodash");

class CallDetails extends React.Component {
    constructor(props) {
        super(props);
        this.user = props.navigation.getParam("user");
        this.listMissedCallsSeen = props.navigation.getParam("listMissedCallsSeen");
        this.updated = false;
        this.listStorage = [];
        this.getListMissedCallsSeen();
        this.state = {
            note: "",
            spinner: false,
            refreshing: true,
            footer: false,
            lastOnline: "",
            listMissedCallsSeen: []
        };
    }

    componentDidMount() {
        this.getLastOnline(this.user.id);
    }

    componentDidUpdate(prevProps) {
        const { callReducer } = this.props;
        if (prevProps.callReducer !== callReducer) {
            if (callReducer.type === types.CALL_DETAILS_SUCCESS) {
                this.setState({ refreshing: false, footer: false });
                this.updateBadgeMissedCall();
                return;
            }
            if (callReducer.type === types.CALL_DETAILS_FAILED) {
                this.setState({ refreshing: false, footer: false });
                // setTimeout(() => {}, 200);
                return;
            }
        }
    }

    getListMissedCallsSeen() {
        AsyncStorage.getItem(Const.LOCAL_STORAGE.MISSED_CALLS_SEEN).then(response => {
            this.onRefresh();
            if (!_.isEmpty(response)) {
                let res = JSON.parse(response);
                this.listStorage = _.isArray(res) ? res : [];
            }
        });
    }

    updateBadgeMissedCall() {
        if (this.updated) return;
        const { userReducer, callReducer } = this.props;
        let missedCall = this.listStorage.filter(el => {
            return el.id == this.user.id;
        });
        let time = _.isEmpty(missedCall) ? 0 : missedCall[0].time;

        let numberOfMissedCall = 0;
        let index = 0;
        let array = callReducer.dataDetails.results.filter(el => {
            index++;
            if (
                !el.duration &&
                el.user_call.id == this.user.id &&
                moment(el.start_time).valueOf() > moment(time).valueOf()
            )
                numberOfMissedCall++;
            return numberOfMissedCall == index;
        });
        if (numberOfMissedCall > 0) {
            let id = userReducer.data.id;
            userActions.getUserData({ id }).then(res => {
                if (!res.error) {
                    let badge =
                        res.response.badge - numberOfMissedCall < 0 ? 0 : res.response.badge - numberOfMissedCall;
                    // let badge = res.response.badge - unreadMessage;
                    let param = {
                        id,
                        badge
                    };
                    userActions.updateBadge(param).then(resp => {
                        this.updated = true;

                        AsyncStorage.setItem(
                            Const.LOCAL_STORAGE.MISSED_CALLS_SEEN,
                            JSON.stringify(this.listMissedCallsSeen)
                        );
                    });
                }
            });
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

    onRefresh() {
        const { userReducer, dispatch } = this.props;
        this.page = 1;
        let params = {
            first_user: userReducer.data.id,
            second_user: this.user.id,
            page: 1
        };
        // let params = userReducer.data.id + "/" +  this.user.id

        this.setState({ refreshing: true }, () => {
            dispatch(callDetailsRequest(params));
        });
    }

    onEndReached() {
        const { callReducer, userReducer, dispatch } = this.props;
        let max = callReducer.dataDetails.numberOfPage;
        if (max <= this.page || this.state.footer) return;
        this.page++;
        let params = {
            first_user: userReducer.data.id,
            second_user: this.user.id,
            page: this.page
        };

        this.setState({ footer: true }, () => {
            dispatch(callDetailsRequest(params));
        });
    }

    renderFooterTeacher() {
        let { footer } = this.state;
        return (
            footer && (
                <View style={{ alignItems: "center", marginTop: Const.PD.PADDING_3, marginBottom: Const.PD.PADDING_1 }}>
                    {/* <View style={{ aspectRatio: 1, borderRadius: 50 }}> */}
                    <ActivityIndicator size="small" color="black" />
                    {/* </View> */}
                </View>
            )
        );
    }

    async onPressChat() {
        this.setState({ spinner: true });
        const user = this.user;
        const { userReducer, dispatch } = this.props;
        let last_message_time = moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
        let params = {
            user_ids: [userReducer.data.id, user.id],
            last_message_time,
            type: GROUP_TYPE.PRIVATE
        };
        let data = await chatHistoriesAction.createdGroupChat(params);

        if (!data.error) {
            this.setState({ spinner: false }, () => {
                const { navigation } = this.props;
                let groupName = user.user.username;
                let avatar = _.isEmpty(user.avatar) ? user.about_user.avatar : user.avatar;
                let id = data.response.chat_room.id;
                navigation.navigate("Chat", {
                    id,
                    chatRoomInfo: data.response,
                    groupName,
                    avatar
                });
            });
        } else {
            this.setState({ spinner: false });
            setTimeout(() => {
                const paramsAlert = {
                    content: I18n.t("Alert.createChatGroupError"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            }, 100);
        }
    }

    goBack() {
        const { navigation } = this.props;
        navigation.goBack();
    }

    noter() {
        let { note } = this.state;
        return note ? (
            <View style={styles.modal}>
                <View style={styles.noteView}>
                    <AppText text={I18n.t("callDetails.note")} style={styles.noteText} />
                    <View style={styles.noteContentView}>
                        <ScrollView style={styles.scroll}>
                            <AppText text={note} style={styles.noteContent} />
                        </ScrollView>
                    </View>
                    <Button
                        title={I18n.t("callDetails.close").toUpperCase()}
                        style={{ height: Const.DIMENSION.BUTTON_HEIGHT - 10 }}
                        onPress={() => this.setState({ note: "" })}
                    />
                </View>
            </View>
        ) : null;
    }

    onNote(note) {
        this.setState({ note });
    }

    renderItem(item, index) {
        const { userReducer } = this.props;
        let callType = 1;
        if (item.user_receive.id !== userReducer.data.id) {
            callType = 0;
        }

        return (
            <View>
                {!index && <View style={{ height: 20 }} />}
                <CardAvatar
                    time={item.start_time}
                    callType={callType}
                    duration={item.duration}
                    onPressNote={note => this.onNote(note)}
                    note={callType == 0 ? item.note_called_user : item.note_received_user}
                    // note={"hahahaha"}
                />
            </View>
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
    onCall = isVideo => {
        const user = this.user;
        let params = {
            avatar: user.avatar,
            nickname: user.user.username,
            calledId: user.id,
            of_user: this.props.userReducer.data.id,
            isVideo: isVideo,
            consultant_fee: user.consultant_fee,
            notificationId: user.notificationId,
            friendType: user.type
        };
        this.props.navigation.navigate("Call", { item: params });
    };
    render() {
        const { callReducer } = this.props;
        let { lastOnline, refreshing } = this.state;
        const { phone_number, user, avatar } = this.user;
        const res = phone_number.substring(1, 20);
        const data = callReducer.dataDetails.results;
        let time = lastOnline
            ? "Online " +
              moment(lastOnline)
                  .local()
                  .fromNow()
            : "Online";
        return (
            <View style={{ flex: 1, backgroundColor: Colors.SKY_BLUE }}>
                {this.spiner()}
                {this.noter()}
                <HeaderImage
                    // twoButton
                    threeButton
                    bgSource={{ uri: avatar }}
                    avatarSource={{ uri: avatar }}
                    title={I18n.t("callDetails.callDetails")}
                    nameStyle={{ fontSize: responsiveFontSize(3) }}
                    onBackPress={() => this.goBack()}
                    infoContent={
                        <View style={styles.content}>
                            <AppText text={user.username} style={styles.nameText} />
                            <AppText text={time} style={styles.onlineText} />
                            <AppText
                                text={phone_number[0] == "0" ? `${`(+84) `} ${res}` : `+${phone_number}`}
                                style={styles.phoneText}
                            />
                        </View>
                    }
                    LBtmPress={this.onCall.bind(this, false)}
                    CBtmPress={this.onCall.bind(this, true)}
                    RBtmPress={() => this.onPressChat()}
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
                <View style={{ flex: 1, marginTop: 26 }}>
                    <FlatList
                        // style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={data}
                        // onEndReached={() => this.onEndReached()}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        refreshing={refreshing}
                        onRefresh={() => this.onRefresh()}
                        onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                        onEndReached={() => this.onEndReached()}
                        ListFooterComponent={this.renderFooterTeacher()}
                    />
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
        callReducer: state.callReducer
    };
}
CallDetails = connect(mapStateToProps)(CallDetails);
export default CallDetails;
