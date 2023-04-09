import React from "react";
import {
    View,
    FlatList,
    Alert,
    Platform,
    AsyncStorage,
    Keyboard,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { HeaderApp, AppText } from "components";
import CardAvatar from "./Component/CardAvatar";
import { chatHistoriesAction, types, alertActions, userActions } from "actions";
import { createGroupName, localSearch } from "./Component/Functions";
import I18n from "helper/locales";
import fbDatabase from "@react-native-firebase/app";
import { DEVICE, GROUP_TYPE, STRING, PD, CHAT_TYPE, USER_TYPE } from "helper/Consts";
import FABButton from "./Component/FABButton";
import ModalGroupSelect from "./Component/ModalGroupSelect";
import { Const, Colors } from "helper";
import { getChatRoomDetail, leaveGroupChat } from "actions/chat/chatHistoriesAction";
import OptionFunction from "./Component/OptionFunction";
import chatFn from "../Chat/Functions";
import { Button, Icon } from "native-base";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { navigateTo } from "actions/navigateAction";
import { SwipeRow } from "react-native-swipe-list-view";

// import { SwipeRow } from "react-native-swipe-list-view";

const _ = require("lodash");
const moment = require("moment");
const PAGE_LIMIT = 10;
const END_PAGE = "Invalid page.";
const NUMBER_MESS = 20;

class ChatHistories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listGroup: [],
            refresh: false,
            page: 1,
            numberOfPage: 1,
            firstTime: true,
            keyboardHeight: 0,
            isVisible: false,
            option: false,
            indexs: [],
            member: [],
            pressNoti: false,
            onlineStatus: [],
            footer: false
        };
        this.refUpdateChanel = fbDatabase
                                    .database().ref(`/user-update-message/${props.userReducer.data.id}`);
        this.searchText = "";
        this.listNotificationSilent = [];
        this.swiper = [];
        this.page = 1;
    }

    UNSAFE_componentWillMount() {
        // const { navigation } = this.props;
        // const firstTime = navigation.getParam("firstTime");
        // AsyncStorage.getItem(STRING.NOTI).then(result => {
        //     if (result) {
        //         AsyncStorage.removeItem(STRING.NOTI).then(() => {
        //             this.navigateToChatByPressNoti();
        //         });
        //     }
        // });
    }

    componentDidMount() {
        // load lai trang khi tu man khac vao
        this.refUpdateChanel.limitToLast(1).on("child_added", childSnapshot => {
            this.onHotReload();
        });
        this.onRefresh();

        // KEYBOARD SHOW EVENT
        this.keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", e => {
            this.setState({ keyboardHeight: e.endCoordinates.height - 60 });
        });

        // KEYBOARD HIDE EVENT
        this.keyboardWillShowListener = Keyboard.addListener("keyboardDidHide", e => {
            this.setState({ keyboardHeight: 0 });
        });

        this.getNotificationSilent();
        this.getOnlineStatus();
    }

    componentDidUpdate(prevProps) {
        let { chatHistoriesReducer, navigateReducer, navigation } = this.props;
        let { page, refresh } = this.state;
        if (chatHistoriesReducer !== prevProps.chatHistoriesReducer) {
            if (chatHistoriesReducer.type == types.CHAT_HISTORIES_SUCCESS) {
                if (navigateReducer.screen == "Chat") {
                    clearTimeout(this.timeout);
                    this.navigateToChatByPressNoti();
                }
                let listGroup = chatHistoriesReducer.data.results;
                let numberOfPage = chatHistoriesReducer.data.numberOfPage;
                this.setState({ listGroup, refresh: false, footer: false, numberOfPage });
            }
            if (chatHistoriesReducer.type == types.CHAT_HISTORIES_FAILED) {
                this.setState({ refresh: false, footer: false });
            }
        }
        if (navigateReducer !== prevProps.navigateReducer) {
            if (navigateReducer.screen == "Chat") {
                this.timeout = setTimeout(() => {
                    this.navigateToChatByPressNoti();
                }, 500);
            }
        }
    }

    navigateToChatByPressNoti() {
        const { navigateReducer, navigation, dispatch, chatHistoriesReducer } = this.props;
        if (_.isEmpty(chatHistoriesReducer.data)) return;
        getChatRoomDetail(navigateReducer.roomId).then(res => {
            if (res.error) {
            } else {
                // setTimeout(() => {
                let roomId = res.response.id;
                let element = chatHistoriesReducer.data.results.find(el => {
                    return el.chat_room.id == roomId;
                });

                let chatRoomInfo = { id: "", chat_room: res.response };
                if (!_.isEmpty(element)) {
                    this.updateBadge(element);
                    chatRoomInfo = { ...element };
                }

                //             if (currentRoot.key == "Chat") {
                this.params = {
                    routeName: "Chat",
                    params: { id: roomId, chatRoomInfo },
                    key: `${roomId}-chat`
                };
                navigation.navigate(this.params);
                // }, 1000);
                dispatch(navigateTo());
            }
        });
    }

    getNotificationSilent() {
        const { userReducer } = this.props;
        fbDatabase
            .database()
            .ref(`/status/`)
            .orderByChild("id")
            .endAt(userReducer.data.id)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                value &&
                    value[0].notificationSilent &&
                    (this.listNotificationSilent = Object.values(value[0].notificationSilent));
                this._closeOptionFn();
            });
    }

    updateNotificationSilent() {
        const { userReducer } = this.props;
        let { id } = this.state;
        let arr = [...this.listNotificationSilent];
        if (this.checkNoti()) {
            arr.push(id);
        } else {
            arr.splice(arr.indexOf(id), 1);
        }
        let params = {
            notificationSilent: arr
        };
        if (this.selectedSwiper) {
            this.selectedSwiper.closeRow();
            this.selectedSwiper = null;
        }

        fbDatabase
            .database()
            .ref(`/status/`)
            .orderByChild("id")
            .endAt(userReducer.data.id)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                if (_.isEmpty(value) || value[0].id != userReducer.data.id) {
                    return;
                } else {
                    const key = Object.keys(message);
                    fbDatabase
                        .database()
                        .ref(`/status/${key[0]}`)
                        .update(params)
                        .then(() => {
                            this.listNotificationSilent = arr;
                            this.setState({
                                id: "",
                                pressNoti: false
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            this.setState({
                                id: "",
                                pressNoti: false
                            });
                        });
                }
            });
    }

    getOnlineStatus() {
        fbDatabase
            .database()
            .ref(`/status/`)
            .on("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                this.setState({ onlineStatus: value });
            });
    }

    loadGroup(id, page) {
        const { dispatch } = this.props;
        let params = {
            user_id: id,
            page: page
        };
        dispatch(chatHistoriesAction.chatHistoriesRequest(params));
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

    navigateToChat(chatRoom) {
        const { navigation, userReducer, contactReducer } = this.props;
        const { chat_room } = chatRoom;
        const { name, users, type } = chat_room;
        const userData = userReducer.data;
        let dataContact = contactReducer.data.response;
        let { groupName, avatar } = createGroupName(name, users, userData.id, dataContact, type);
        // NAVIGATE TO CHAT SCREEN
        navigation.navigate("Chat", {
            id: chat_room.id,
            chatRoomInfo: chatRoom,
            groupName,
            avatar
        });
        this.updateBadge(chatRoom);
    }

    updateBadge(chatRoom) {
        const { userReducer } = this.props;
        const { id, chat_room, last_message_seen_index } = chatRoom;
        const { last_message_index } = chat_room;
        let params = {
            id,
            body: {
                last_message_seen_index: last_message_index
            }
        };
        let unreadMessage = last_message_index - last_message_seen_index;
        if (unreadMessage < 1) return;
        chatHistoriesAction.updateLastSeenMessage(params).then(res => {
            if (!res.error) {
                this.onHotReload();
                let idUser = userReducer.data.id;
                userActions.getUserData({ id: idUser }).then(res => {
                    let badge = res.response.badge - unreadMessage < 0 ? 0 : res.response.badge - unreadMessage;
                    // let badge = res.response.badge - unreadMessage;
                    let param = {
                        id: idUser,
                        badge
                    };
                    userActions.updateBadge(param).then(resp => console.log(resp));
                });
            }
        });
    }

    showSettingNotification(id, index, member) {
        // this.refChannel = fbDatabase.database().ref(`/chat-group/${id}`);
        this.setState(
            {
                // option: true,
                id,
                member
            },
            () => {
                if (this.selectedSwiper && this.selectedSwiper !== this.swiper[index]) {
                    this.selectedSwiper.closeRow();
                }
                this.swiper[index].manuallySwipeRow(-75);
                this.selectedSwiper = this.swiper[index];
            }
        );
    }

    _closeOptionFn() {
        this.setState({
            option: false
        });
    }

    renderItem(item, index) {
        const { userReducer, contactReducer, dispatch } = this.props;
        let { onlineStatus } = this.state;
        const userData = userReducer.data;
        if (_.isEmpty(userData)) {
            return null;
        } else {
            const { chat_room, last_message_seen_index } = item;
            const {
                id,
                last_message_time,
                name,
                users,
                last_message,
                last_message_index,
                last_message_type,
                type
            } = chat_room;
            const disabled =
                userReducer.data.type === USER_TYPE.STUDENT &&
                !userReducer.data.is_sub &&
                users.some(el => el.type === USER_TYPE.TEACHER);
            let online = true;
            if (type == GROUP_TYPE.PRIVATE && users.length > 1) {
                let guess = users.find(el => {
                    return el.id != userData.id;
                });
                let status = onlineStatus.find(el => {
                    return el.id == guess.id;
                });
                if (!_.isEmpty(status)) {
                    online = status.status;
                }
            }

            // users.map(el => {
            //     let index = onlineStatus.findIndex(e => {
            //         return e.id == el.id;
            //     });
            //     if (index > 0 && !onlineStatus[index].status && onlineStatus[index].id != userData.id) {
            //         online = false;
            //     }
            // });

            let time = last_message_time;
            let dataContact = contactReducer.data.response;
            let covertData = createGroupName(name, users, userData.id, dataContact, type);
            let groupName = covertData.groupName;
            let source = covertData.avatar;
            let unreadMessage = last_message_index - last_message_seen_index;

            return (
                <CardAvatar
                    disabled={disabled}
                    online={online}
                    userId={userData.id}
                    messageType={last_message_type}
                    chatRoom={chat_room}
                    time={time}
                    source={source}
                    groupName={groupName}
                    lastMessage={last_message}
                    unreadMessage={unreadMessage}
                    onPress={() => (disabled ? dispatch(alertActions.openModal()) : this.navigateToChat(item))}
                    onLongPress={() =>
                        disabled ? dispatch(alertActions.openModal()) : this.showSettingNotification(id, index, users)
                    }
                    notificationSilent={this.listNotificationSilent.indexOf(id) > -1}
                    loadingNotiSilent={id == this.state.id && this.state.pressNoti}
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
            type: "",
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
                    this.setState({ listGroup: response.response.results });
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
            type: "",
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
                    let listGroup = response.response.results;
                    this.setState({ listGroup: _.concat(...this.state.listGroup, listGroup) });
                }
                this.setState({ footer: false });
            });
        });
    }

    closeSwiper() {
        this.selectedSwiper ? this.selectedSwiper.closeRow() : null;
        this.selectedSwiper = "";
    }

    onChangeText(e) {
        let { chatHistoriesReducer } = this.props;
        let listGroup = chatHistoriesReducer.data.results;
        this.closeSwiper();

        if (!_.isEmpty(e)) {
            this.searchText = e.trim();
            this.searchGroupChat(e);
        } else {
            this.searchText = "";
            this.setState({ listGroup });
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

    toggleModal() {
        const { isVisible } = this.state;
        this.setState({ isVisible: !isVisible });
    }

    onCreatedRoomSuccess(id, chatRoomInfo) {
        let { navigation } = this.props;
        this.setState({ isVisible: false }, () => {
            setTimeout(() => {
                navigation.navigate("Chat", { id, chatRoomInfo });
            }, 100);
        });
    }

    onCreatedRoomError() {
        const { dispatch } = this.props;
        this.setState({ isVisible: false }, () => {
            setTimeout(() => {
                const paramsAlert = {
                    content: I18n.t("Alert.createChatGroupError"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            }, 500);
        });
    }

    checkNoti() {
        let { id } = this.state;
        return this.listNotificationSilent.indexOf(id) < 0;
    }

    onPressNoti() {
        this.setState({ pressNoti: true }, () => {
            this.updateNotificationSilent();
            this._closeOptionFn();
        });
    }

    // sendTofbDatabase(systemMess) {
    //     const { id } = this.state;
    //     fbDatabase
    //         .database()
    //         .ref(`/chat-group/${id}`)
    //         .push(systemMess[0])
    //         .then(data => {
    //             const item = Object.values(data.toJSON());
    //         })
    //         .catch(error => console.log("error", error));
    // }

    // sendSystemMessageToRoom(type, memberInfo) {
    //     const { id, member } = this.state;
    //     const { userReducer } = this.props;
    //     const user = chatFn.converUser(userReducer.data);
    //     const userDetail = userReducer.data.user;
    //     const name = `${userDetail.first_name} ${userDetail.last_name}`;
    //     fbDatabase
    //         .database()
    //         .ref(`/chat-group/${id}`)
    //         .limitToLast(1)
    //         .once("value")
    //         .then(data => {
    //             // TODO: GET LAST MESSAGE INDEX
    //             let last_message_index = 0;
    //             if (_.isEmpty(data.toJSON())) {
    //                 last_message_index = 0;
    //             } else {
    //                 const item = Object.values(data.toJSON());
    //                 last_message_index = item[0].index;
    //             }
    //             let systemMess = "";
    //             switch (type) {
    //                 case CHAT_TYPE.LEAVE_ROOM:
    //                     systemMess = chatFn.convertSystemLeaveRoom(name, user, last_message_index, member);
    //                     this.sendTofbDatabase(systemMess);
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         });
    // }

    // async onLeaveGroup() {
    //     const { id } = this.state;
    //     const { userReducer, dispatch, navigation } = this.props;
    //     const userId = userReducer.data.id;
    //     const response = await leaveGroupChat(id, userId);
    //     if (response.error) {
    //         const paramsAlert = {
    //             content: I18n.t("Alert.leaveGroupChatError"),
    //             title: I18n.t("Alert.notice"),
    //             type: Const.ALERT_TYPE.ERROR
    //         };
    //         dispatch(alertActions.openAlert(paramsAlert));
    //     } else {
    //         if (this.selectedSwiper) {
    //             this.selectedSwiper.close();
    //             this.selectedSwiper = null;
    //         }
    //         this.onRefresh();
    //         let createdAt = moment.utc().valueOf();
    //         this.sendSystemMessageToRoom(CHAT_TYPE.LEAVE_ROOM, []);
    //         fbDatabase
    //             .database()
    //             .ref(`/user-update-message/${userId}`)
    //             .push({ createdAt })
    //             .then(data => {
    //                 // navigation.navigate("ChatHistories");
    //             })
    //             .catch(error => {
    //                 console.log("error ", error);
    //             });
    //     }
    // }

    onDeleteGroupChat() {
        const { dispatch } = this.props;
        let { idRow, last_message_seen_index, id } = this.state;

        let utcMoment = moment().utc();
        let deleted_time = utcMoment.format("YYYY-MM-DDTHH:mm:ss.SSSSSS");

        let params = {
            id: idRow,
            body: {
                deleted_time,
                last_message_seen_index
            }
        };

        if (this.selectedSwiper) {
            this.selectedSwiper.closeRow();
            this.selectedSwiper = null;
        }

        chatHistoriesAction.deleteGroupChat(params).then(response => {
            if (response.error) {
                const paramsAlert = {
                    content: I18n.t("Alert.deleteGroupFailed"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            } else {
                dispatch(chatHistoriesAction.deletedMessRoomRequest(id));
                this.onRefresh();
            }
        });
    }

    _funcNotification() {
        const noti = this.checkNoti();
        Alert.alert(I18n.t("Alert.notice"), noti ? I18n.t("Alert.requestOff") : I18n.t("Alert.requestOn"), [
            {
                text: I18n.t("Alert.cancel"),
                style: "cancel"
            },
            { text: "OK", onPress: () => this.onPressNoti() }
        ]);
    }

    _funcLeaveGroup() {
        Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.askDeleteGroup"), [
            {
                text: I18n.t("Alert.cancel"),
                style: "cancel"
            },
            // { text: "OK", onPress: () => this.onLeaveGroup() }
            { text: "OK", onPress: () => this.onDeleteGroupChat() }
        ]);
    }

    _pressFunction(func) {
        setTimeout(() => {
            switch (func) {
                case "notification":
                    this._funcNotification();
                    break;
                case "leave":
                    this._funcLeaveGroup();
                    break;
                default:
                    break;
            }
        }, 100);
    }

    renderRight() {
        const notification = this.checkNoti();
        return (
            <View style={{ position: "absolute", right: 0, height: "100%", width: 75 }}>
                <View style={styles.functionWrap}>
                    <TouchableOpacity
                        onPress={() => this._pressFunction("notification")}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: PD.PADDING_2
                        }}
                    >
                        <Icon
                            name={notification ? "ios-notifications-off" : "ios-notifications"}
                            style={{
                                color: notification ? Colors.RED_COLOR : Colors.MAIN_COLOR
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this._pressFunction("leave")}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: PD.PADDING_2
                        }}
                    >
                        <Icon name={"ios-trash"} style={{ color: Colors.RED_COLOR }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onRowOpen(item, index) {
        if (this.selectedSwiper && this.selectedSwiper !== this.swiper[index]) {
            this.selectedSwiper.closeRow();
        }
        this.selectedSwiper = this.swiper[index];
        this.setState({
            id: item.chat_room.id,
            idRow: item.id,
            last_message_seen_index: item.chat_room.last_message_index
        });
    }

    renderSwipeRow(item, index) {
        const { userReducer } = this.props;
        return (
            <SwipeRow
                ref={ref => (this.swiper[index] = ref)}
                rightOpenValue={-75}
                onRowOpen={() => this.onRowOpen(item, index)}
                disableRightSwipe
                disableLeftSwipe={userReducer.data.type === USER_TYPE.STUDENT && !userReducer.data.is_sub}
                swipeToOpenPercent={30}
            >
                {this.renderRight()}
                {this.renderItem(item, index)}
            </SwipeRow>
        );
    }
    closeModal() {
        this.setState({ isVisible: false });
    }
    convertListGroup(listGroup) {
        return listGroup.filter(el => {
            let deleted_time = el.deleted_time ? moment(el.deleted_time).valueOf() : 0;
            let last_message_time = moment(el.chat_room.last_message_time).valueOf();
            return last_message_time > deleted_time;
        });
    }
    renderFooterTeacher() {
        let { footer, refresh } = this.state;
        return (
            !refresh &&
            footer && (
                <View style={{ alignItems: "center", marginTop: Const.PD.PADDING_3, marginBottom: Const.PD.PADDING_1 }}>
                    {/* <View style={{ aspectRatio: 1, borderRadius: 50 }}> */}
                    <ActivityIndicator size="small" color="black" />
                    {/* </View> */}
                </View>
            )
        );
    }
    render() {
        let { listGroup, refresh, keyboardHeight, isVisible, option } = this.state;
        let { navigation } = this.props;
        let data = this.convertListGroup(listGroup);

        return (
            <View style={styles.container}>
                <HeaderApp
                    isSearch
                    title={I18n.t("chat.header")}
                    navigation={navigation}
                    rightOnPress={e => this.onChangeText(e)}
                />
                <View
                    style={{
                        flex: 1,
                        backgroundColor: Colors.CONTENT_COLOR
                    }}
                >
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        // data={listGroup}
                        data={data}
                        contentContainerStyle={{ paddingBottom: keyboardHeight }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={listGroup}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                        renderItem={({ item, index }) => this.renderSwipeRow(item, index)}
                        refreshing={refresh}
                        onRefresh={() => this.onRefresh()}
                        ListEmptyComponent={() => this.emptyList()}
                        ListFooterComponent={this.renderFooterTeacher()}
                    />
                </View>
                <FABButton onPress={() => this.toggleModal()} />
                <ModalGroupSelect
                    modalVisibleToggle={() => this.closeModal()}
                    isVisible={isVisible}
                    leftOnPress={() => this.toggleModal()}
                    onCreatedRoomSuccess={(id, chatRoomInfo) => this.onCreatedRoomSuccess(id, chatRoomInfo)}
                    onCreatedRoomError={() => this.onCreatedRoomError()}
                />

                {/* <OptionFunction
                    visible={option}
                    closeOption={() => this._closeOptionFn()}
                    notification={this.checkNoti()}
                    onPressNoti={() => this.onPressNoti()}
                    onPressLeave={() => this.onLeaveGroup()}
                    // message={selectedMess}
                    // mine={mine}
                    // roomId={roomId}
                    // ondeleted={() => this._updateMessage()}
                /> */}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        chatHistoriesReducer: state.chatHistoriesReducer,
        contactReducer: state.contactReducer,
        navigateReducer: state.navigateReducer
    };
}
ChatHistories = connect(mapStateToProps)(ChatHistories);
export default ChatHistories;
