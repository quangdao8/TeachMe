import React from "react";
import { View, FlatList, Keyboard } from "react-native";
import { connect } from "react-redux";
import { Const, Colors, Convert } from "helper";
import { types, alertActions } from "actions";
import { AppText } from "components";
import styles from "./styles";
import { FONT_SF } from "assets";
import I18n from "helper/locales";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { getContactRequest } from "actions/contactActions";
import { nospecial, characters } from "./data";
import CardContactShare from "screens/Teacher/component/CardContactShare";
import chatFn from "screens/Chats/Chat/Functions.js";
import { chatHistoriesAction } from "actions";
import firebase from "@react-native-firebase/app";
import { GROUP_TYPE, CHAT_TYPE, USER_TYPE, DEVICE } from "helper/Consts";
import { createGroupName } from "screens/Chats/ChatHistories/Component/Functions";
import { Spinner, Toast } from "native-base";
import CardContactForward from "../Components/CardContactForward";

const height = Const.DEVICE.DEVICE_HEIGHT;
const _ = require("lodash");
const moment = require("moment");

class ShareContact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            userName: "",
            error: "",
            active: false,
            loading: false,
            groupData: [],
            favoriteData: [],
            backupData: [],
            refresh: false,

            initialRender: 1,
            isActive: true,
            keyboardHeight: 60,
            spinner: false,
            listIdContactSent: []
        };
        this.inputRefs = {};
        this.deviceContact = [];
        this.valueSearch = "";
        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentDidUpdate(prevProps) {
        const { contactReducer, dispatch, search } = this.props;
        const { refresh } = this.state;
        if (prevProps.contactReducer !== contactReducer) {
            if (contactReducer.type === types.GET_CONTACT_SUCCESS) {
                this.processContact();
            }
        }

        if (search !== prevProps.search) {
            this.onSearch(search);
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = e => {
        this.setState({
            keyboardHeight: e.endCoordinates.height + 60 - 55
        });
    };

    _keyboardDidHide = () => {
        this.setState({ keyboardHeight: 60 });
    };

    updateRoomChat(chat_room, messages) {
        for (let i in chat_room.users) {
            let createdAt =
                _.isEmpty(messages) && _.isEmpty(messages[0]) ? moment.utc().valueOf() : messages[0].createdAt;

            let user = chat_room.users[i];
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

    navigateToChat(item) {
        this.setState({ spinner: true }, async () => {
            const { userReducer, dispatch, navigation } = this.props;
            const message = navigation.getParam("message");

            let last_message_time = moment()
                .utc()
                .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
            let params = {
                user_ids: [userReducer.data.id, item.about_user.id],
                last_message_time,
                type: GROUP_TYPE.PRIVATE
            };
            let data = await chatHistoriesAction.createdGroupChat(params);
            if (!data.error) {
                const chatRoomInfo = data.response;
                const { chat_room } = chatRoomInfo;
                const { last_message_index } = chat_room;
                const userData = userReducer.data;
                const user = chatFn.converUser(userData);
                const forwardMess = chatFn.convertForwardMessage(message, user, last_message_index);
                let param = chatFn.enCryptMessage(forwardMess);
                firebase
                    .database()
                    .ref(`/chat-group/${chat_room.id}`)
                    .push(param)
                    .then(async response => {
                        let id = data.response.chat_room.id;
                        let paramsLastMessage = chatFn.lastMessParam(forwardMess, id, user, last_message_index)
                            .lastMessage;
                        chatHistoriesAction.updateLastMessage(paramsLastMessage).then(() => {
                            setTimeout(() => {
                                let params = chatFn.lastMessParam(forwardMess, chatRoomInfo.id, user, forwardMess.index)
                                    .lastSeenMessage;
                                chatHistoriesAction.updateLastSeenMessage(params).then(res => {
                                    if (!res.error) {
                                        let listIdContactSent = [...this.state.listIdContactSent, item.id];
                                        setTimeout(() => {
                                            this.setState({ spinner: false }, () => {
                                                Toast.show({
                                                    text: I18n.t("toast.forwardMessSuccess"),
                                                    type: "success"
                                                });
                                                setTimeout(() => {
                                                    this.setState({ listIdContactSent });
                                                }, 200);
                                            });
                                            this.updateRoomChat(chat_room, [forwardMess]);
                                            this.sendNotification(chatRoomInfo, chat_room, forwardMess, user);
                                        }, 500);
                                    }
                                });
                            }, 500);
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                this.setState({ spinner: false });
                setTimeout(() => {
                    const paramsAlert = {
                        content: I18n.t("Alert.networkErr"),

                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.ERROR
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                }, 100);
            }
        });
    }

    sendNotification(currentRoom, chatRoomInfo, messages, user) {
        const dataContact = this.props.contactReducer.data.response;
        const { groupName } = createGroupName(
            currentRoom.name,
            chatRoomInfo.users,
            user.id,
            dataContact,
            chatRoomInfo.type
        );
        let notificationId = [];
        let results = chatRoomInfo.users.map(async item => {
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
        });
        Promise.all(results).then(() => {
            const body = this.convertNoti(messages.type, messages.text);
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
                    title: group_type == GROUP_TYPE.GROUP ? name + I18n.t("chat.send") + group_name : name
                },
                message: {
                    body,
                    title,
                    type: "Chat",
                    chatRoomId: chatRoomInfo.id,
                    group_type
                }
            };
            chatHistoriesAction.sendNotiForOther(content);
        });
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

    renderItem(item, index) {
        const { navigation } = this.props;
        let { listIdContactSent } = this.state;
        let sent = listIdContactSent.indexOf(item.id) > -1;
        return <CardContactForward key={index} item={item} onPress={() => this.navigateToChat(item)} sent={sent} />;
    }

    divideGroupArray(data) {
        const groups = [];
        characters.map(c => {
            const sameCharatersGroup = [];
            data.map(user => {
                if (_.isEmpty(user.nickname)) {
                    return;
                }
                let covertFirst = Convert.removeDiacritics(user.nickname[0].toLowerCase());
                if (covertFirst == c) {
                    sameCharatersGroup.push(user);
                } else {
                    if (c == "#") {
                        if (!_.includes(nospecial, covertFirst)) {
                            sameCharatersGroup.push(user);
                        }
                    }
                }
            });
            groups.push(sameCharatersGroup);
        });
        return groups;
    }

    renderGroup(groups, indexGroup) {
        if (groups.length === 0) {
            return null;
        }
        return (
            <View>
                <AppText
                    style={{ marginLeft: 10, fontFamily: FONT_SF.BOLD, fontSize: 16 }}
                    text={`${characters[indexGroup].toUpperCase()}`}
                />
                {groups.map((user, index) => this.renderItem(user, index))}
            </View>
        );
    }

    processContact() {
        const { contactReducer, dispatch, userReducer } = this.props;
        if (_.isEmpty(this.valueSearch)) {
            let contact;
            if (userReducer.data.type == USER_TYPE.TEACHER) {
                contact = contactReducer.data.response;
            } else {
                contact = _.filter(contactReducer.data.response, function(o) {
                    return o.about_user.type == 0;
                });
            }
            const data = this.divideGroupArray(contact);
            this.setState(
                { groupData: data, backupData: contact, initialRender: contact.length, refresh: false },
                () => {
                    this.setState({ loading: false });
                }
            );
        } else {
            this.onSearch(this.valueSearch);
        }
    }

    onSearch(value) {
        let { backupData } = this.state;

        if (value.trim()) {
            this.valueSearch = value.trim();
            let mainData = [];
            for (let i in backupData) {
                if (!_.isEmpty(backupData[i].about_user.phone_number.toLowerCase())) {
                    if (
                        _.includes(
                            Convert.removeDiacritics(backupData[i].nickname.toLowerCase()),
                            Convert.removeDiacritics(value.toLowerCase())
                        ) ||
                        _.includes(backupData[i].about_user.phone_number.toLowerCase(), value.toLowerCase())
                    ) {
                        mainData.push(backupData[i]);
                    }
                }
            }
            const data = this.divideGroupArray(mainData);
            this.setState({ groupData: data, refresh: false });
        } else {
            this.valueSearch = "";
            const data = this.divideGroupArray(backupData);
            this.setState({ groupData: data, refresh: false });
        }
    }

    renderCharacter() {
        const top = getStatusBarHeight(isIphoneX()) + 80;
        const fs = (height - top) / 39;
        return (
            <View style={styles.containerCharacter}>
                {characters.map((item, index) => {
                    return (
                        <AppText
                            canPress
                            onPress={() => {
                                this.flatlist.scrollToIndex({ animated: true, index });
                            }}
                            text={item.toUpperCase()}
                            key={index}
                            style={{
                                lineHeight: fs,
                                fontSize: fs * 0.7,
                                color: Colors.GRAY_TEXT_COLOR,
                                textAlign: "center"
                            }}
                        />
                    );
                })}
            </View>
        );
    }

    loadGroup() {
        const { dispatch, userReducer } = this.props;
        let params = {
            of_user__id: userReducer.data.id
        };

        dispatch(getContactRequest(params));
    }

    onRefresh() {
        this.setState({ refresh: true }, () => {
            this.loadGroup();
        });
    }

    spinner() {
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

    renderContact() {
        const { tabs, refresh, initialRender, keyboardHeight } = this.state;
        const groupsData = this.state.groupData;

        return (
            <View style={{ flex: 1, width: "100%" }}>
                <FlatList
                    initialNumToRender={initialRender}
                    ref={ref => (this.flatlist = ref)}
                    contentContainerStyle={{ paddingBottom: keyboardHeight }}
                    showsVerticalScrollIndicator={false}
                    data={groupsData}
                    extraData={this.state}
                    renderItem={({ item, index }) => this.renderGroup(item, index)}
                    keyExtractor={(item, index) => `${index}`}
                    refreshing={refresh}
                    onRefresh={() => this.onRefresh()}
                />
                {this.renderCharacter()}
                {this.spinner()}
            </View>
        );
    }

    render() {
        return this.renderContact();
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer
    };
}
ShareContact = connect(mapStateToProps)(ShareContact);
export default ShareContact;
