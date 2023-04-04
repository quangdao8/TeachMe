import React from "react";
import { View, FlatList, Alert, Platform, AsyncStorage, Keyboard } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { HeaderApp, AppText } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import chatFn from "screens/Chats/Chat/Functions.js";

import { chatHistoriesAction, types, alertActions } from "actions";

import I18n from "helper/locales";
import firebase from "@react-native-firebase/app";
import { DEVICE, GROUP_TYPE } from "helper/Consts";
import CardAvatar from "screens/Chats/ChatHistories/Component/CardAvatar";
import { createGroupName } from "screens/Chats/ChatHistories/Component/Functions";
import { Colors, Const } from "helper";

const _ = require("lodash");
const moment = require("moment");
const PAGE_LIMIT = 10;
const END_PAGE = "Invalid page.";
const NUMBER_MESS = 20;

class ShareGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listGroupData: [],
            refresh: false,
            page: 1,
            numberOfPage: 1,
            firstTime: true,
            keyboardHeight: 60,
            footer: false
        };
        this.refUpdateChanel = firebase.database().ref(`/user-update-message/${props.userReducer.data.id}`);
        this.searchText = "";
    }

    componentDidMount() {
        // load lai trang khi tu man khac vao
        this.refUpdateChanel.limitToLast(1).on("child_added", childSnapshot => {
            this.onHotReload();
        });
        this.onRefresh();

        // KEYBOARD SHOW EVENT
        this.keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", e => {
            this.setState({ keyboardHeight: e.endCoordinates.height + 60 - 55 });
        });

        // KEYBOARD HIDE EVENT
        this.keyboardWillShowListener = Keyboard.addListener("keyboardDidHide", e => {
            this.setState({ keyboardHeight: 60 });
        });
    }

    componentDidUpdate(prevProps) {
        let { chatHistoriesReducer, search } = this.props;
        let { page, refresh } = this.state;
        if (chatHistoriesReducer !== prevProps.chatHistoriesReducer) {
            if (chatHistoriesReducer.type == types.CHAT_HISTORIES_GROUP_SUCCESS) {
                let listGroupData = chatHistoriesReducer.dataGroup.results;
                let numberOfPage = chatHistoriesReducer.dataGroup.numberOfPage;
                this.setState({ listGroupData, refresh: false, footer: false, numberOfPage });
            }
            if (chatHistoriesReducer.type == types.CHAT_HISTORIES_GROUP_FAILED) {
                this.setState({ refresh: false });
            }
        }

        if (search !== prevProps.search) {
            this.onChangeText(search);
        }
    }

    loadGroup(id, page) {
        const { dispatch } = this.props;
        let params = {
            user_id: id,
            page: page,
            type: GROUP_TYPE.GROUP
        };
        dispatch(chatHistoriesAction.chatHistoriesGroupRequest(params));
    }

    onEndReached() {
        let { numberOfPage, page, firstTime, refresh, footer } = this.state;
        if (footer || refresh) return;

        if (firstTime) {
            this.setState({ firstTime: false });
        } else {
            this.searchGroupChatNext(this.searchText);
            const { userReducer } = this.props;
            const user = userReducer.data;
            if (page < numberOfPage) {
                page++;
                this.setState({ page, footer: true }, () => {
                    this.loadGroup(user.id, page);
                });
            } else {
            }
        }
    }

    onHotReload() {
        const { userReducer } = this.props;
        const user = userReducer.data;
        if (!_.isEmpty(this.searchText)) {
            this.searchGroupChat(this.searchText);
        } else {
            this.setState({ page: 1 }, () => {
                this.loadGroup(user.id, 1);
            });
        }
    }

    onRefresh() {
        const { userReducer } = this.props;
        const user = userReducer.data;
        if (!_.isEmpty(this.searchText)) {
            this.searchGroupChat(this.searchText);
        } else {
            this.setState({ page: 1, refresh: true }, () => {
                this.loadGroup(user.id, 1);
            });
        }
    }

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

    navigateToChat(chatRoom) {
        const { navigation, userReducer, contactReducer } = this.props;
        const { chat_room } = chatRoom;
        const { name, users, last_message_index, id } = chat_room;
        const userData = userReducer.data;
        let dataContact = contactReducer.data.response;
        const contact = navigation.getParam("contact");
        const user = chatFn.converUser(userReducer.data);
        const cardContact = chatFn.convertCardContact(contact, user, last_message_index);
        let param = chatFn.enCryptMessage(cardContact[0]);

        firebase
            .database()
            .ref(`/chat-group/${chat_room.id}`)
            .push(param)
            .then(data => {
                let params = chatFn.lastMessParam(cardContact[0], id, user, last_message_index).lastMessage;
                chatHistoriesAction.updateLastMessage(params);
                setTimeout(() => {
                    this.updateRoomChat(chat_room, cardContact);
                }, 500);
                navigation.navigate("Chat", { id: chat_room.id, chatRoomInfo: chatRoom });
            })
            .catch(error => {
                console.log(error);
            });
    }

    renderItem(item, index) {
        const { userReducer, contactReducer } = this.props;
        const userData = userReducer.data;
        if (_.isEmpty(userData)) {
            return null;
        } else {
            const { chat_room, last_message_seen_index } = item;
            const {
                last_message_time,
                name,
                users,
                last_message,
                last_message_index,
                last_message_type,
                type
            } = chat_room;
            let time = last_message_time;
            let dataContact = contactReducer.data.response;
            let covertData = createGroupName(name, users, userData.id, dataContact, type);
            let groupName = covertData.groupName;
            let source = covertData.avatar;
            let unreadMessage = last_message_index - last_message_seen_index;
            return (
                <CardAvatar
                    userId={userData.id}
                    messageType={last_message_type}
                    chatRoom={chat_room}
                    time={time}
                    source={source}
                    groupName={groupName}
                    lastMessage={last_message}
                    unreadMessage={unreadMessage}
                    onPress={() => this.navigateToChat(item)}
                />
            );
        }
    }

    searchGroupChat(e) {
        this.page = 1;
        this.endSearch = false;
        let { userReducer, dispatch } = this.props;
        let param = {
            search: e.trim(),
            user_id: userReducer.data.id,
            type: GROUP_TYPE.GROUP,
            page: this.page
        };
        this.setState({ refresh: true }, () => {
            chatHistoriesAction.searchGroupChat(param).then(response => {
                if (response.error) {
                    this.endSearch = true;
                    const paramsAlert = {
                        content: I18n.t("Alert.createChatGroupError"),
                        // content: data.errorMessage,
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.ERROR
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                } else {
                    if (this.page > response.response.count / PAGE_LIMIT) this.endSearch = true;
                    this.setState({ listGroupData: response.response.results });
                }
                this.setState({ refresh: false });
            });
        });
    }

    searchGroupChatNext(e) {
        if (!e.trim() || this.endSearch) return;
        this.page++;
        let { userReducer, dispatch } = this.props;
        let param = {
            search: e.trim(),
            user_id: userReducer.data.id,
            type: GROUP_TYPE.GROUP,
            page: this.page
        };
        this.setState({ footer: true }, () => {
            chatHistoriesAction.searchGroupChat(param).then(response => {
                if (response.error) {
                    this.endSearch = true;
                    const paramsAlert = {
                        content: I18n.t("Alert.createChatGroupError"),
                        // content: data.errorMessage,
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.ERROR
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                } else {
                    if (this.page > response.response.count / PAGE_LIMIT) this.endSearch = true;
                    let listGroupData = response.response.results;
                    this.setState({ listGroupData: _.concat(...this.state.listGroupData, listGroupData) });
                }
                this.setState({ footer: false });
            });
        });
    }

    onChangeText(e) {
        let { chatHistoriesReducer } = this.props;
        let listGroupData = chatHistoriesReducer.dataGroup ? chatHistoriesReducer.dataGroup.results : [];
        if (!_.isEmpty(e.trim())) {
            this.setState({ refresh: true });
            this.searchText = e.trim();
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.searchGroupChat(e);
            }, 500);
        } else {
            this.searchText = "";
            this.setState({ listGroupData, refresh: false });
        }
    }

    emptyList() {
        let { refresh } = this.state;
        return (
            !refresh && (
                <View style={styles.containerEmpty}>
                    <AppText text={I18n.t("chat.emptyList")} style={styles.emptyText} />
                    <AppText text={I18n.t("chat.suggest")} style={styles.emptySuggest} />
                </View>
            )
        );
    }

    convertListGroup(listGroup) {
        return listGroup.filter(el => {
            let deleted_time = el.deleted_time ? moment(el.deleted_time).valueOf() : 0;
            let last_message_time = moment(el.chat_room.last_message_time).valueOf();
            return last_message_time > deleted_time;
        });
    }

    render() {
        let { listGroupData, refresh, keyboardHeight } = this.state;
        let { navigation } = this.props;
        let data = this.convertListGroup(listGroupData);
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, backgroundColor: Colors.CONTENT_COLOR }}>
                    <FlatList
                        data={data}
                        contentContainerStyle={{ paddingBottom: keyboardHeight }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={listGroupData}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        refreshing={refresh}
                        onRefresh={() => this.onRefresh()}
                        ListEmptyComponent={() => this.emptyList()}
                    />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        chatHistoriesReducer: state.chatHistoriesReducer,
        contactReducer: state.contactReducer
    };
}
ShareGroup = connect(mapStateToProps)(ShareGroup);
export default ShareGroup;
