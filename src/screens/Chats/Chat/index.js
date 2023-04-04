import React from "react";
import { View, Keyboard, Platform } from "react-native";
import { connect } from "react-redux";
import { GiftedChat } from "react-native-gifted-chat";
import firebase from "@react-native-firebase/app";
import OpBubbleMessage from "./Component/OpBubbleMessage";
import MyBubbleMessage from "./Component/MyBubbleMessage";
import Avatar from "./Component/Avatar";
import styles from "./styles";
import RenderInputToolbar from "./Component/RenderInputToolbar";
import RenderChatFooter from "./Component/RenderChatFooter";
import chatFn from "./Functions";
import { HeaderChat } from "components";
import { chatHistoriesAction, alertActions } from "actions";
import Giphy from "./Component/Giphy";
import AndroidKeyboardAdjust from "react-native-android-keyboard-adjust";
import { CHAT_TYPE, GROUP_TYPE, USER_TYPE } from "helper/Consts";
import { createGroupName } from "../ChatHistories/Component/Functions";
import { Const, Colors } from "helper";
import I18n from "helper/locales";
import { CHAT_ROOM_CURRENT_SUCCESS } from "actions/types";
import { saveChatMessage } from "actions/chat/chatActions";
import OptionFunction from "./Component/OptionFunction";
import RenderReplyMessage from "./Component/RenderReplyMessage";
import "moment/locale/vi";

const moment = require("moment");
const _ = require("lodash");
const NUMBER_MESS = 20;
const NUMBER_EARLY = NUMBER_MESS + 1;

class Chat extends React.Component {
    constructor(props) {
        const chatRoomInfo = props.navigation.getParam("chatRoomInfo");
        const roomId = props.navigation.getParam("id");
        super(props);
        this.state = {
            messages: [],
            user: chatFn.converUser(props.userReducer.data),
            login: false,
            showAddition: false,
            // load early message
            loadEarly: false,
            showLoadEarly: false,
            showFooter: false,
            imageLoading: [],
            groupName: "",
            avatar: "",
            roomId,
            chatRoomInfo: {},
            showOptionFn: false,
            selectedMess: {},
            mine: false,
            messageReplied: "",
            lastOnline: " "
        };
        this.refChannel = firebase.database().ref(`/chat-group/${roomId}`);
        this.refChannelSeen = firebase.database().ref(`/chat-group-seen/${roomId}`);
        // CHANEL TEST
        this.chatRoomInfo = chatRoomInfo;
        this.goToDetail = false;
        this.index = 0;
        this.deleted_time = 0;
    }

    componentWillMount() {
        // TODO: USE LOCAL DATA
        const { messageRoom, userReducer, contactReducer, navigation, chatHistoriesReducer } = this.props;
        const { roomId } = this.state;
        let params = {
            user_id: userReducer.data.id,
            chat_room_id: roomId
        };

        // chatHistoriesReducer.data.results.map(el => {
        //     if (el.chat_room.id == roomId) {
        //         this.deleted_time = el.deleted_time ? moment(el.deleted_time).valueOf() : 0;
        //     }
        // });
        // const chatRoomInfo = navigation.getParam("chatRoomInfo");
        // let deleted_time = chatRoomInfo.deleted_time ? moment(chatRoomInfo.deleted_time).valueOf() : 0;

        const index = _.findIndex(messageRoom, obj => {
            return roomId == obj.roomId;
        });

        if (index > -1) {
            const messagess = messageRoom[index].message;
            this.deleted_time = messageRoom[index].deleted_time || 0;

            let messages = messagess.filter(el => {
                let createdAt = moment(el.createdAt).valueOf();
                return createdAt > this.deleted_time;
            });

            const { roomInfo } = messageRoom[index];
            const { name, users, type } = roomInfo;
            const localUserId = userReducer.data.id;
            const dataContact = contactReducer.data.response;
            const dataChat = createGroupName(name, users, localUserId, dataContact, type);
            const { groupName, avatar } = dataChat;
            this.setState({ messages, chatRoomInfo: roomInfo, groupName, avatar });
            this.chatRoomInfo = roomInfo;
        }
        Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustResize();
        // TODO: GET DATA
        this.getRoomInfo();
    }

    componentDidMount() {
        const { userReducer } = this.props;
        const { roomId } = this.state;
        let params = {
            user_id: userReducer.data.id,
            chat_room_id: roomId
        };
        // const chatRoomInfo = navigation.getParam("chatRoomInfo");
        // let deleted_time = chatRoomInfo.deleted_time ? moment(chatRoomInfo.deleted_time).valueOf() : 0;
        chatHistoriesAction.getDeletedTime(params).then(res => {
            if (res.error) {
            } else {
                let del_time = _.isEmpty(res.response.results) ? "" : res.response.results[0].deleted_time;
                del_time && (this.deleted_time = moment.utc(del_time).valueOf());
            }
            this.refChannel.limitToLast(NUMBER_MESS).on("child_added", childSnapshot => {
                let value = chatFn.deCryptMessage(childSnapshot.toJSON());
                const message = [value];
                this.index = message[0].index;
                let createdAt = moment(message[0].createdAt).valueOf();
                if (createdAt > this.deleted_time) {
                    this.onProcessMessage(message);
                }
            });
            this._updateMessage();
        });
    }

    _updateMessage() {
        const { roomId, user } = this.state;
        this.refChannel.on("child_changed", child => {
            const childMessage = [chatFn.deCryptMessage(child.toJSON())];
            let { messages } = this.state;
            let indexMess = _.findIndex(messages, function(o) {
                return o._id == childMessage[0]._id;
            });
            if (indexMess > -1) {
                messages[indexMess] = childMessage[0];
                this.setState({ messages });
                if (indexMess == 0 && !_.isNumber(childMessage[0].deleteId)) {
                    let params = chatFn.lastMessParam(childMessage[0], roomId, user, childMessage[0].index).lastMessage;
                    chatHistoriesAction.updateLastMessage(params);
                    setTimeout(() => {
                        this.updateRoomChat();
                    }, 1000);
                }
            }
        });
    }

    componentDidUpdate(prevProp) {
        const { chatHistoriesReducer, userReducer, contactReducer, navigateReducer, navigation } = this.props;
        if (chatHistoriesReducer !== prevProp.chatHistoriesReducer) {
            if (chatHistoriesReducer.type === CHAT_ROOM_CURRENT_SUCCESS) {
                const { currentRoom } = chatHistoriesReducer;
                const { name, users, type } = currentRoom;
                const localUserId = userReducer.data.id;
                const dataContact = contactReducer.data.response;
                const dataChat = createGroupName(name, users, localUserId, dataContact, type);
                const { groupName, avatar } = dataChat;
                this.setState({ groupName, avatar, chatRoomInfo: currentRoom });
                this.chatRoomInfo = currentRoom;
                this.setStatus(users, type);
            }
        }

        if (prevProp.navigateReducer !== navigateReducer) {
            if (navigateReducer.screen == "Chat") {
                this.leftOnPress();
                // this.props.navigation.pop();
            }
        }
    }

    saveLocalMessage() {
        const { dispatch, userReducer, contactReducer } = this.props;
        const { messages, roomId, chatRoomInfo } = this.state;
        const messToSave = _.uniqBy(messages, "_id");
        messToSave.splice(20);
        const params = {
            roomId,
            message: messToSave,
            roomInfo: chatRoomInfo,
            deleted_time: this.deleted_time
        };
        dispatch(saveChatMessage(params));
    }

    componentWillUnmount() {
        Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustPan();
        const { dispatch } = this.props;
        if (this.goToDetail) {
        } else {
            // REMOVE REDUCER CURRENT ROOM INFO
            dispatch(chatHistoriesAction.chatRoomCurrentRemove());
            this.saveLocalMessage();
            this.updateLastSeenMessage();
            setTimeout(() => {
                this.updateRoomChat();
            }, 1000);
        }
    }

    setStatus(users, type) {
        const { userReducer, navigation } = this.props;
        const { user } = this.state;
        const { name } = userReducer.data;
        // const chatRoomInfo = navigation.getParam("chatRoomInfo");
        if (this.chatRoomInfo.last_message_index == 0 && type == GROUP_TYPE.GROUP) {
            let value = `${name} ${I18n.t("chat.memberCreateRoom")}`;
            let message = chatFn.convertMessage(value, user, 0);
            this.onSend(message);
        }
        if (type == GROUP_TYPE.GROUP) return;
        let id = users[0].id;
        if (users[0].id == userReducer.data.id && users.length > 1) {
            id = users[1].id;
        }
        this.getLastOnline(id);
    }

    getLastOnline(id) {
        firebase
            .database()
            .ref(`/status/`)
            .orderByChild("id")
            .endAt(id)
            .limitToLast(1)
            .once("value", childSnapshot => {
                let time = "";
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                if (value && value[0].onlineStatusTime && !value[0].status && value[0].id == id) {
                    time = value[0].onlineStatusTime;
                }

                let lastOnline = time
                    ? "Online " +
                      moment(time)
                          .local()
                          .fromNow()
                    : "Online";

                this.setState({
                    lastOnline
                });
            });
    }

    getRoomInfo() {
        const { dispatch, navigation } = this.props;
        const id = navigation.getParam("id");
        if (id) {
            dispatch(chatHistoriesAction.chatRoomCurrentRequest({ id }));
        }
    }

    processSystemMessage(message) {
        const mess = message[0];
        switch (mess.type) {
            case CHAT_TYPE.CHANGE_NAME:
                const event = `${mess.text} ${I18n.t("chat.changeGroupName")}`;
                mess.text = event;
                this.appendMessage([mess]);
                this.getRoomInfo();
                this.updateRoomChat();
                break;
            case CHAT_TYPE.ADD_MEMBER:
                const event2 = `${mess.text} ${I18n.t("chat.addMemberMess")} ${mess.member} ${I18n.t(
                    "chat.addMemberMess2"
                )}`;
                mess.text = event2;
                this.appendMessage([mess]);
                this.getRoomInfo();
                this.updateRoomChat();
                break;
            case CHAT_TYPE.CREATE_ROOM:
                const event3 = `${mess.text} ${I18n.t("chat.memberCreateRoom")}`;
                mess.text = event3;
                this.appendMessage([mess]);
                this.getRoomInfo();
                this.updateRoomChat();
                break;
            case CHAT_TYPE.LEAVE_ROOM:
                const event4 = `${mess.text} ${I18n.t("chat.memberLeaveRoom")}`;
                mess.text = event4;
                this.appendMessage([mess]);
                this.getRoomInfo();
                this.updateRoomChat();
                break;
            default:
                this.appendMessage(message);
                break;
        }
    }

    onProcessMessage(message) {
        let { imageLoading, messages } = this.state;
        if (_.isEmpty(imageLoading)) {
            this.processSystemMessage(message);
        } else {
            let index = _.findIndex(imageLoading, function(o) {
                return o._id == message[0]._id;
            });
            let indexMess = _.findIndex(messages, function(o) {
                return o._id == message[0]._id;
            });
            if (index > -1) {
                // REMOVE ITEM IN IMAGELOADING
                imageLoading.splice(index, 1);
                // REMOVE ITEM IN MESSAGES
                messages.splice(indexMess, 1, message[0]);
                this.setState({ imageLoading, messages });
            } else {
                this.appendMessage(message);
            }
        }
    }

    updateLastSeenMessage(messageInput) {
        // UPDATE LAST SEEN MESSAGE
        if (!_.isNumber(this.props.navigation.getParam("chatRoomInfo").id)) return;
        let { messages, user } = this.state;
        if (messages.length > 0) {
            let index = messages[0].index || this.index;
            const roomWithMeId = this.props.navigation.getParam("chatRoomInfo").id;
            let params = chatFn.lastMessParam(messages[0], roomWithMeId, user, index).lastSeenMessage;
            chatHistoriesAction.updateLastSeenMessage(params);
        }
    }

    convertNoti(messageType, lastMessage) {
        let message = "";
        switch (messageType) {
            case CHAT_TYPE.IMAGE:
                message = I18n.t("chat.imageType");
                break;
            case CHAT_TYPE.IMAGES:
                message = I18n.t("chat.imagesType");
                break;
            case CHAT_TYPE.FILE:
                message = I18n.t("chat.fileType");
                break;
            case CHAT_TYPE.LOCATION:
                message = I18n.t("chat.locationType");
                break;
            case CHAT_TYPE.CONTACT:
                message = I18n.t("chat.contactType");
                break;
            case CHAT_TYPE.REPLY:
                message = I18n.t("chat.replyType");
                break;
            default:
                message = lastMessage;
                break;
        }
        return message;
    }

    sendNotification() {
        const { currentRoom } = this.props.chatHistoriesReducer;
        let { messages, user, groupName, chatRoomInfo } = this.state;

        let notificationId = [];
        let results = this.chatRoomInfo.users.map(async item => {
            // return item.notificationId;
            if (item.id != user.id) {
                if (item.type == USER_TYPE.STUDENT) {
                    notificationId.push(item.notificationId);
                    return item.notificationId;
                }
                await firebase
                    .database()
                    .ref(`/status/`)
                    .orderByChild("id")
                    .endAt(item.id)
                    .limitToLast(1)
                    .once("value", childSnapshot => {
                        const message = childSnapshot.toJSON();
                        let value = message ? Object.values(message) : "";
                        if (
                            value &&
                            value[0].id == item.id &&
                            value[0].notificationSilent &&
                            Object.values(value[0].notificationSilent).indexOf(chatRoomInfo.id) > -1
                        ) {
                            return;
                        }
                        if (value == "" || value[0].id != item.id || value[0].status) {
                            notificationId.push(item.notificationId);
                            return item.notificationId;
                        }
                    });
            }
            // notificationId.push(userN.notificationId);
        });
        Promise.all(results).then(() => {
            const body = this.convertNoti(messages[0].type, messages[0].text);
            let name = user.name;
            let group_type = currentRoom.type;
            let group_name = group_type == GROUP_TYPE.GROUP ? groupName : "";
            const title = {
                name,
                group_name
            };
            let content = {
                notificationId,
                noti: {
                    body,
                    title: group_type == GROUP_TYPE.GROUP ? name + " gửi tới " + group_name : name
                },
                message: {
                    body,
                    title,
                    type: "Chat",
                    chatRoomId: this.chatRoomInfo.id,
                    group_type
                }
            };
            chatHistoriesAction.sendNotiForOther(content);
        });
    }

    updateRoomChat() {
        let { messages, user } = this.state;

        for (let i in this.chatRoomInfo.users) {
            let createdAt =
                _.isEmpty(messages) && _.isEmpty(messages[0]) ? moment.utc().valueOf() : messages[0].createdAt;

            let user = this.chatRoomInfo.users[i];
            // SET NOTIFICATION ID
            firebase
                .database()
                .ref(`/user-update-message/${user.id}`)
                .push({ createdAt })
                .then(data => {})
                .catch(error => {
                    console.log("error ", error);
                });
        }
    }

    appendMessage(messages = []) {
        this.setState(
            previousState => ({
                messages: _.uniqBy(GiftedChat.append(previousState.messages, messages), "_id")
            }),
            () => {
                if (this.state.messages.length > NUMBER_MESS - 1) {
                    this.setState({ showLoadEarly: true });
                } else {
                    this.setState({ showLoadEarly: false });
                }
            }
        );
    }

    prependMessage(messages = []) {
        this.setState(previousState => ({
            messages: _.uniqBy(GiftedChat.prepend(previousState.messages, messages), "_id")
        }));
    }

    onSend(messages = []) {
        const { roomId, user, chatRoomInfo } = this.state;
        let index = messages[0].index;
        let param = chatFn.enCryptMessage(messages[0]);
        this.setState({ showFooter: false, messageReplied: "" });
        this.refChannel
            .push(param)
            .then(data => {
                // UPDATE LAST MESSAGE
                const { chat_room } = chatRoomInfo;
                let params = chatFn.lastMessParam(messages[0], roomId, user, index).lastMessage;
                chatHistoriesAction.updateLastMessage(params);
                this.sendNotification();
                // UPDATE LAST SEEN MESSAGE
                this.updateLastSeenMessage();
                // UPDATE MESSAGE LIST
                setTimeout(() => {
                    this.updateRoomChat();
                }, 1000);
            })
            .catch(error => {
                console.log("error ", error);
            });
    }

    loadEarlier() {
        let { messages } = this.state;
        this.setState({ loadEarly: true });
        let lastTime = _.last(messages).createdAt;
        this.refChannel
            .orderByChild("createdAt")
            .endAt(lastTime)
            .limitToLast(NUMBER_EARLY)
            .once("value", childSnapshot => {
                let messObj = childSnapshot.toJSON();
                let messArray = chatFn.objToArrayWithoutLast(messObj);
                if (messArray.length < 1) {
                    this.setState({ loadEarly: false, showLoadEarly: false });
                } else {
                    this.setState({ loadEarly: false }, () => {
                        messArray.forEach(mes => {
                            this.prependMessage([chatFn.deCryptMessage(mes)]);
                        });
                    });
                }
            });
    }

    onSendFile(value) {
        this.onSend(value);
        this.setState({ showAddition: false });
    }

    onSendGif() {
        this.setState(prevState => ({
            showAddition: false,
            showFooter: !prevState.showFooter
        }));
    }

    _showOptionFn(mes, from) {
        this.setState({ selectedMess: mes, mine: from }, () => {
            this.setState({ showOptionFn: true });
        });
    }

    _closeOptionFn(mes, from) {
        this.setState({ showOptionFn: false });
    }

    renderBubble(message) {
        let { imageLoading } = this.state;
        const { navigation } = this.props;
        if (this.state.user._id == message.user._id) {
            return (
                <MyBubbleMessage
                    imageLoading={imageLoading}
                    message={message}
                    navigation={navigation}
                    onLongPressMess={(mes, from) => this._showOptionFn(mes, !from)}
                />
            );
        } else {
            return (
                <OpBubbleMessage
                    imageLoading={imageLoading}
                    message={message}
                    navigation={navigation}
                    onLongPressMess={mes => this._showOptionFn(mes, false)}
                />
            );
        }
    }

    renderAvatar(data) {
        let source = data.user.avatar;
        return <Avatar source={{ uri: source }} />;
    }

    onLoadingImage(value) {
        this.setState(prevState => ({
            imageLoading: _.concat(prevState.imageLoading, value)
        }));
        this.appendMessage(value);
    }

    showAddition() {
        Keyboard.dismiss();
        if (this.state.showFooter) {
            this.setState(prevState => ({ showFooter: false }));
        }
        this.setState(prevState => ({ showAddition: !prevState.showAddition }));
    }

    sendImageError(id) {
        const { dispatch } = this.props;
        let { imageLoading, messages } = this.state;
        const index = _.findIndex(imageLoading, function(o) {
            return o._id == id;
        });
        const indexMess = _.findIndex(messages, function(o) {
            return o._id == id;
        });
        if (index > -1) {
            // REMOVE ITEM IN IMAGELOADING
            imageLoading.splice(index, 1);
            // REMOVE ITEM IN MESSAGES
            messages.splice(indexMess, 1);
            this.setState({ imageLoading, messages });
        }
        setTimeout(() => {
            const paramsAlert = {
                content: I18n.t("Alert.uploadimageError"),
                title: I18n.t("Alert.notice"),
                type: Const.ALERT_TYPE.ERROR
            };
            dispatch(alertActions.openAlert(paramsAlert));
        }, 50);
    }

    renderInputToolbar() {
        let { messages, messageReplied } = this.state;
        let lastMessage = messages[0] || { index: this.index };

        return (
            <RenderInputToolbar
                lastMessage={lastMessage}
                user={this.state.user}
                onLoadingImage={value => this.onLoadingImage(value)}
                onPressSend={value => this.onSend(value)}
                onSendImage={value => this.onSend(value)}
                showAddition={this.state.showAddition}
                onPressAddition={value => this.showAddition()}
                onFocus={() => this.setState({ showAddition: false, showFooter: false })}
                sendImageError={id => this.sendImageError(id)}
                messageReplied={messageReplied}
            />
        );
    }

    showFooterRender() {
        let { showAddition, showFooter, messageReplied } = this.state;

        if (showFooter) {
            return this.renderChatFooterGiphy();
        }
        if (messageReplied) {
            return this.renderChatFooterReply();
        }
        // if (showAddition) {
        return this.renderChatFooter();
        // }
    }

    renderChatFooter() {
        let { messages } = this.state;
        let lastMessage = messages[0] || { index: this.index };
        return (
            <RenderChatFooter
                onLoadingImage={value => this.onLoadingImage(value)}
                onSendImage={value => this.onSend(value)}
                // onLoadingImage={value => this.onLoadingImage(value)}
                lastMessage={lastMessage}
                user={this.state.user}
                onSendFile={value => this.onSend(value)}
                onPress={() => this.setState({ showAddition: false })}
                onSendGif={() => this.onSendGif()}
            />
        );
    }

    renderChatFooterGiphy() {
        let { messages } = this.state;
        let lastMessage = messages[0] || { index: this.index };
        return (
            <Giphy
                lastMessage={lastMessage}
                user={this.state.user}
                onSend={value => this.onSend(value)}
                onClose={() => this.onSendGif()}
            />
        );
    }

    renderChatFooterReply() {
        const { messageReplied } = this.state;
        return (
            <RenderReplyMessage message={messageReplied} onPressClose={() => this.setState({ messageReplied: "" })} />
        );
    }

    rightOnFirstPress() {
        const { navigation } = this.props;
        const { params } = navigation.state;
        const { chatRoomInfo } = params;
        const { chat_room } = chatRoomInfo;
        const { users } = chat_room;
        const friendInfo = users.find(item => {
            return item.id !== this.props.userReducer.data.id;
        });
        const item = {
            avatar: navigation.getParam("avatar"),
            nickname: navigation.getParam("groupName"),
            calledId: friendInfo.id,
            of_user: this.props.userReducer.data.id,
            isVideo: false,
            from: "Chat",
            consultant_fee: friendInfo.consultant_fee,
            notificationId: friendInfo.notificationId,
            friendType: friendInfo.type
        };
        navigation.navigate("Call", {
            item
        });
    }

    rightOnSecondPress() {
        const { navigation } = this.props;
        const { params } = navigation.state;
        const { chatRoomInfo } = params;
        const { chat_room } = chatRoomInfo;
        const { users } = chat_room;
        const friendInfo = users.find(item => {
            return item.id !== this.props.userReducer.data.id;
        });
        const item = {
            avatar: navigation.getParam("avatar"),
            nickname: navigation.getParam("groupName"),
            calledId: friendInfo.id,
            of_user: this.props.userReducer.data.id,
            isVideo: true,
            from: "Chat",
            consultant_fee: friendInfo.consultant_fee,
            notificationId: friendInfo.notificationId,
            friendType: friendInfo.type
        };
        navigation.navigate("Call", {
            item
        });
    }

    onPressTitle() {
        const { navigation, userReducer, contactReducer } = this.props;
        // const chatRoomInfo = navigation.getParam("chatRoomInfo");
        const chatRoomInfo = this.state.chatRoomInfo;
        if (chatRoomInfo.type == GROUP_TYPE.GROUP) {
            this.goToDetail = true;
            navigation.navigate("GroupChatDetail", { chatRoomInfo });
        } else {
            let item = chatRoomInfo.users[0];
            if (item.id == userReducer.data.id) {
                item = chatRoomInfo.users[1];
            }
            const detailUser = _.filter(contactReducer.data.response, { about_user: { id: item.id } });
            userReducer.data.type == 0
                ? item.type == 0
                    ? navigation.navigate("ContactDetails", {
                          contact: _.isEmpty(detailUser)
                              ? { about_user: item, nickname: item.user.first_name + " " + item.user.last_name }
                              : detailUser[0],
                          screen: "GroupDetail"
                      })
                    : navigation.navigate("DetailTeacher", {
                          contact: { teacher: item, name: item.user.first_name + " " + item.user.last_name },
                          screen: "GroupDetail"
                      })
                : navigation.navigate("ContactDetails", {
                      contact: _.isEmpty(detailUser)
                          ? { about_user: item, nickname: item.user.first_name + " " + item.user.last_name }
                          : detailUser[0],
                      screen: "GroupDetail"
                  });
        }
    }

    leftOnPress() {
        const { navigation } = this.props;
        this.goToDetail = false;
        navigation.goBack();
    }

    onForward(mess) {
        this.goToDetail = false;
        const { navigation } = this.props;
        navigation.navigate("ForwardMessage", { message: mess });
        this._closeOptionFn();
    }

    onReply(messageReplied) {
        this.setState({
            messageReplied
        });
        this._closeOptionFn();
    }

    render() {
        const { navigation } = this.props;
        let {
            messages,
            user,
            showLoadEarly,
            loadEarly,
            groupName,
            avatar,
            chatRoomInfo,
            showOptionFn,
            selectedMess,
            mine,
            roomId,
            lastOnline
        } = this.state;
        return (
            <View style={styles.container}>
                <HeaderChat
                    leftOnPress={() => this.leftOnPress()}
                    disableTitle={
                        !_.isEmpty(chatRoomInfo) &&
                        chatRoomInfo.users.length < 2 &&
                        chatRoomInfo.type == GROUP_TYPE.PRIVATE
                    }
                    onPressTitle={() => this.onPressTitle()}
                    name={groupName}
                    isBack
                    rightOnFirstPress={() => this.rightOnFirstPress()}
                    rightOnSecondPress={() => this.rightOnSecondPress()}
                    navigation={navigation}
                    source={avatar}
                    disableRight={!_.isEmpty(chatRoomInfo) && chatRoomInfo.type == GROUP_TYPE.GROUP}
                    status={lastOnline}
                />
                <GiftedChat
                    listViewProps={{
                        contentContainerStyle: {
                            backgroundColor: Colors.CONTENT_COLOR
                        },
                        showsVerticalScrollIndicator: false
                    }}
                    isAnimated
                    renderAvatarOnTop
                    renderChatFooter={() => this.showFooterRender()}
                    minInputToolbarHeight={60}
                    renderInputToolbar={() => this.renderInputToolbar()}
                    renderBubble={({ currentMessage, previousMessage }) =>
                        this.renderBubble(currentMessage, previousMessage)
                    }
                    messages={_.uniqBy(messages, "_id")}
                    extraData={messages[0]}
                    user={user}
                    onLoadEarlier={() => this.loadEarlier()}
                    loadEarlier={showLoadEarly}
                    isLoadingEarlier={loadEarly}
                    onLongPress={() => {}}
                />
                <OptionFunction
                    visible={showOptionFn}
                    closeOption={() => this._closeOptionFn()}
                    message={selectedMess}
                    mine={mine}
                    roomId={roomId}
                    onForward={message => this.onForward(message)}
                    onReply={message => this.onReply(message)}
                    // ondeleted={() => this._updateMessage()}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        contactReducer: state.contactReducer,
        userReducer: state.userReducer,
        chatHistoriesReducer: state.chatHistoriesReducer,
        messageRoom: state.chatHistoriesReducer.messageRoom,
        navigateReducer: state.navigateReducer
    };
}
Chat = connect(mapStateToProps)(Chat);
export default Chat;
