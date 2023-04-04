import React from "react";
import { View, FlatList, Alert, Platform, Keyboard, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { HeaderApp, AppText, LocalNotification } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import CardAvatar from "./Component/CardAvatar";
import { types, alertActions, userActions } from "actions";
import { getNicknameAndAvatar } from "./Component/Functions";
import I18n from "helper/locales";
import { callHistoryRequest, callDeleteRequest } from "actions/callActions";
import { Convert, Const, Colors } from "helper";
import { Button, Icon } from "native-base";
import { switchOnlineStatus } from "actions/settingActions";
import { USER_TYPE } from "helper/Consts";
import firebase from "@react-native-firebase/app";
import { getUserData } from "actions/userActions";
import { navigateTo } from "actions/navigateAction";
import { SwipeRow } from "react-native-swipe-list-view";

const _ = require("lodash");
const moment = require("moment");

class CallHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            onSearch: false,
            indexs: [],
            keyboardHeight: 10,
            listMissedCallsSeen: []
        };
        this.swiper = [];
        this.listName = [];
        this.valueSearch = "";
        this.unread = false;
        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
        this.onPressNoti();
    }

    componentDidMount() {
        AsyncStorage.getItem(Const.LOCAL_STORAGE.MISSED_CALLS_SEEN).then(response => {
            if (!_.isEmpty(response)) {
                let res = JSON.parse(response);
                let listMissedCallsSeen = _.isArray(res) ? res : [];
                this.setState({ listMissedCallsSeen });
            }
            this.onRefresh();
        });
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    onPressNoti() {
        const { navigateReducer, contactReducer, navigation, dispatch } = this.props;
        if (navigateReducer.screen == "Call") {
            AsyncStorage.getItem(Const.LOCAL_STORAGE.MISSED_CALLS_SEEN).then(result => {
                if (!_.isEmpty(result)) {
                    let res = JSON.parse(result);
                    let list = _.isArray(res) ? res : [];
                    getUserData({ id: navigateReducer.roomId }).then(res => {
                        if (res.error) {
                        } else {
                            let user = res.response;
                            const dataContact = contactReducer.data.response ? contactReducer.data.response : [];
                            const data = getNicknameAndAvatar(user, dataContact);
                            user.avatar = data.avatar;
                            user.user.username = data.nickname;
                            let time = moment()
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
                            let array = list.filter(el => {
                                return el.id != user.id;
                            });
                            let param = {
                                id: user.id,
                                time
                            };
                            let listMissedCallsSeen = [...array, param];
                            setTimeout(() => {
                                navigation.navigate("CallDetails", {
                                    user,
                                    listMissedCallsSeen
                                });
                            }, 0);
                            dispatch(navigateTo());
                        }
                    });
                }
            });
        }
    }

    updateOnlineStatus(status) {
        const { userReducer } = this.props;
        if (userReducer.data.type == USER_TYPE.STUDENT) {
            return;
        }
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        let params = {
            id: userReducer.data.id,
            status: status,
            onlineStatusTime: createdAt
        };
        firebase
            .database()
            .ref(`/status/`)
            .orderByChild("id")
            .endAt(userReducer.data.id)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                if (_.isEmpty(value) || value[0].id != userReducer.data.id) return;
                const key = Object.keys(message);
                firebase
                    .database()
                    .ref(`/status/${key[0]}`)
                    .update(params)
                    .then(value => {
                        console.log("status updated");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
    }

    onRefresh() {
        const { userReducer, dispatch } = this.props;
        this.setState({ refresh: true }, () => {
            dispatch(callHistoryRequest(userReducer.data.id));
            this.closeSwiper();
        });
    }

    _keyboardDidShow = e => {
        this.setState({
            onSearch: true,
            keyboardHeight: e.endCoordinates.height + 10 - 55
        });
        this.closeSwiper();
    };

    _keyboardDidHide = () => {
        this.setState({ onSearch: false, keyboardHeight: 10 });
        this.closeSwiper();
    };

    componentDidUpdate(prevProps) {
        const { callReducer, contactReducer, userReducer, navigateReducer } = this.props;
        if (prevProps.callReducer !== callReducer) {
            if (callReducer.type === types.CALL_HISTORY_FAILED) {
                this.setState({ refresh: false });
                setTimeout(() => {}, 200);
                return;
            }
            if (callReducer.type === types.CALL_HISTORY_SUCCESS) {
                this.setState({ refresh: false });
                this.listName = [];
                this.unread = false;

                callReducer.data.map(item => {
                    let user = item.user_call;
                    if (item.user_receive.id !== userReducer.data.id) {
                        user = item.user_receive;
                    }
                    const dataContact = contactReducer.data.response ? contactReducer.data.response : [];
                    const data = getNicknameAndAvatar(user, dataContact);
                    user.avatar = data.avatar;
                    user.user.username = data.nickname;

                    this.listName.push(Convert.removeDiacritics(user.user.username.toLowerCase()));
                });

                this.onChangeText(this.valueSearch);
                this.resetBadge();
                return;
            }
        }
        if (navigateReducer !== prevProps.navigateReducer) {
            this.onPressNoti();
        }
    }

    resetBadge() {
        setTimeout(() => {
            if (!this.unread) {
                const { chatHistoriesReducer, userReducer } = this.props;
                let { id } = userReducer.data;
                let badge = 0;
                if (!_.isEmpty(chatHistoriesReducer.data)) {
                    let array = this.convertListGroupChat(chatHistoriesReducer.data.results);
                    array.map(item => {
                        const { chat_room, last_message_seen_index } = item;
                        const { last_message_index } = chat_room;
                        let unreadMessage = last_message_index - last_message_seen_index;
                        badge += unreadMessage > 0 ? unreadMessage : 0;
                    });
                }

                let param = {
                    id,
                    badge
                };
                userActions.updateBadge(param);
            }
        }, 2000);
    }

    convertListGroupChat(listGroup) {
        return listGroup.filter(el => {
            let deleted_time = el.deleted_time ? moment(el.deleted_time).valueOf() : 0;
            let last_message_time = moment(el.chat_room.last_message_time).valueOf();
            return last_message_time > deleted_time;
        });
    }

    onEndReached() {}

    onHotReload() {}

    onRefresh() {
        const { userReducer, dispatch } = this.props;
        this.setState({ refresh: true }, () => {
            dispatch(callHistoryRequest(userReducer.data.id));
            this.closeSwiper();
        });
    }

    onCall(isVideo, item) {
        const { callReducer } = this.props;
        let { nickname, avatar, callType, user } = this.avatarNname(item);
        let params = {
            avatar,
            nickname,
            calledId: user.id,
            of_user: this.props.userReducer.data.id,
            isVideo: isVideo,
            from: "Call history",
            consultant_fee: user.consultant_fee,
            notificationId: user.notificationId,
            friendType: user.type
        };
        this.props.navigation.navigate("Call", { item: params });
    }

    avatarNname(item) {
        const { userReducer, contactReducer } = this.props;
        let user = item.user_call;
        let callType = 1;
        if (item.user_receive.id !== userReducer.data.id) {
            user = item.user_receive;
            callType = 0;
        }
        const dataContact = contactReducer.data.response ? contactReducer.data.response : [];

        const data = getNicknameAndAvatar(user, dataContact);
        return { nickname: data.nickname, callType, avatar: data.avatar, user };
    }

    async deleteCallHistory(item) {
        const { dispatch, userReducer } = this.props;

        let { user } = this.avatarNname(item);

        let params = userReducer.data.id + "/" + user.id;

        const response = await callDeleteRequest(params);

        if (response.error) {
            setTimeout(() => {
                const paramsAlert = {
                    content: I18n.t("Alert.deleteFailed"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.INFO
                };
                dispatch(alertActions.openAlert(paramsAlert));
                // Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.inputPhonePlease"));
            }, 200);
        } else {
            this.onRefresh();
        }
    }

    alert(item) {
        Alert.alert(
            I18n.t("Alert.notice"),
            I18n.t("Alert.askDeleteCall"),
            [
                {
                    text: I18n.t("Alert.cancel"),
                    onPress: () => this.closeSwiper(),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.deleteCallHistory(item) }
            ],
            { cancelable: false }
        );
    }

    closeSwiper() {
        this.selectedSwiper ? this.selectedSwiper.closeRow() : null;
        this.selectedSwiper = "";
    }

    renderRight(item, index) {
        return (
            <View style={{ position: "absolute", right: 0, height: "100%", width: 75 }}>
                <Button
                    danger
                    onPress={() => {
                        this.alert(item);
                    }}
                    style={{ height: "100%", width: "100%", justifyContent: "center" }}
                >
                    <Icon active name="ios-trash" />
                </Button>
            </View>
        );
    }

    onRowOpen(index) {
        if (this.selectedSwiper && this.selectedSwiper !== this.swiper[index]) {
            this.selectedSwiper.closeRow();
        }
        this.selectedSwiper = this.swiper[index];
    }

    renderSwipeRow(item, index) {
        return this.state.indexs.indexOf(index) > -1 ? (
            // <SwipeRow
            //     ref={ref => (this.swiper[index] = ref)}
            //     leftOpenValue={75}
            //     rightOpenValue={-75}
            //     body={this.renderItem(item)}
            //     right={this.renderRight(item, index)}
            //     disableRightSwipe={true}
            //     style={styles.swiper}
            //     onRowOpen={() => this.onRowOpen(index)}
            // />
            <SwipeRow
                ref={ref => (this.swiper[index] = ref)}
                rightOpenValue={-75}
                onRowOpen={() => this.onRowOpen(index)}
                disableRightSwipe
                swipeToOpenPercent={30}
            >
                {this.renderRight(item)}
                {this.renderItem(item, index)}
            </SwipeRow>
        ) : null;
    }

    renderItem(item, index) {
        const { userReducer, dispatch } = this.props;
        let { listMissedCallsSeen } = this.state;
        let { nickname, avatar, callType, user } = this.avatarNname(item);
        const disabled =
            userReducer.data.type === USER_TYPE.STUDENT && !userReducer.data.is_sub && user.type === USER_TYPE.TEACHER;

        return (
            <CardAvatar
                disabled={disabled}
                user={user}
                callType={callType}
                time={item.start_time}
                source={avatar}
                name={nickname}
                callSuccess={item.duration}
                onTouch={value => {
                    if (disabled) {
                        dispatch(alertActions.openModal());
                        return;
                    }
                    user.avatar = avatar;
                    user.user.username = nickname;
                    this.onPress(value, user);
                }}
                // onPress={value => {
                //     user.avatar = avatar;
                //     user.user.username = nickname;
                //     this.onPress(value, user);
                // }}
                onPressCall={isVideo => (disabled ? dispatch(alertActions.openModal()) : this.onCall(isVideo, item))}
                listMissedCallsSeen={listMissedCallsSeen}
                unread={unread => unread && (this.unread = true)}
            />
        );
        // }
    }

    onPress(listMissedCallsSeen, user) {
        const { navigation } = this.props;
        navigation.navigate("CallDetails", {
            user,
            listMissedCallsSeen
        });
        if (!_.isEmpty(listMissedCallsSeen)) {
            this.unread = false;
            this.setState({ listMissedCallsSeen }, () => {
                this.resetBadge();
            });
        }
    }

    searchFn(value) {
        let valueConvert = Convert.removeDiacritics(value);
        let indexs = [];
        this.listName.map((el, index) => {
            if (el.includes(valueConvert) || !value) {
                indexs = [...indexs, index];
            }
        });
        return indexs;
    }

    onChangeText(value) {
        this.valueSearch = value;
        let valueNew = value.trim().toLowerCase();
        if (!valueNew) {
            this.closeSwiper();
        }
        // this.setState({ indexs: [] });
        // let index = 0;
        // let indexs = [];
        // this.listName.map( el => {
        //     if (el.includes(value) || !value) {
        //         indexs = [...indexs, index];
        //     }
        //     index++;
        // });
        this.setState({ indexs: this.searchFn(valueNew) });
    }

    renderModal() {
        let { onSearch } = this.state;
        return false ? <View style={styles.modal} /> : null;
    }

    onValueChange(value) {
        const { dispatch } = this.props;
        this.updateOnlineStatus(value);
        dispatch(switchOnlineStatus(value));

        if (!value) {
            // const paramsAlert = {
            //     content: I18n.t("Alert.switchOffline"),
            //     title: I18n.t("Alert.notice"),
            //     type: Const.ALERT_TYPE.INFO
            // };
            // dispatch(alertActions.openAlert(paramsAlert));
            this.notiRef.openNoti("", I18n.t("Alert.switchOffline"));
        }
    }

    emptyList() {
        let { refresh } = this.state;
        return (
            !refresh && (
                <View style={styles.containerEmpty}>
                    {/* <AppText text={I18n.t("chat.emptyList")} style={styles.emptyText} /> */}
                    <AppText text={I18n.t("callHistory.noCall")} style={styles.emptyText} />
                </View>
            )
        );
    }

    render() {
        const { callReducer, userReducer, settingReducer, dispatch } = this.props;
        let { refresh, indexs, keyboardHeight } = this.state;
        const data = callReducer.data;
        const type = userReducer.data.type;

        return (
            <View style={styles.container}>
                <HeaderApp
                    isSearch
                    isSwitch={type}
                    initSwitch={settingReducer.data.onlineStatus}
                    onValueChange={value => this.onValueChange(value)}
                    title={I18n.t("chat.header")}
                    // titleStyle={{ fontSize: responsiveFontSize(2.6) }}
                    onChangeText={e => this.onChangeText(e)}
                />
                <View style={{ flex: 1, backgroundColor: Colors.CONTENT_COLOR }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: keyboardHeight }}
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={indexs}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                        renderItem={({ item, index }) => this.renderSwipeRow(item, index)}
                        refreshing={refresh}
                        onRefresh={() => this.onRefresh()}
                        ListEmptyComponent={
                            this.emptyList()
                            // () => !refresh && <AppText text={I18n.t("callHistory.noCall")} style={styles.empty} />
                        }
                    />
                    {_.isEmpty(indexs) && !_.isEmpty(this.listName) ? (
                        <AppText text={I18n.t("callHistory.noResult")} style={styles.noResult} />
                    ) : null}
                </View>
                {this.renderModal()}
                <LocalNotification onRef={noti => (this.notiRef = noti)} reminder />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        callReducer: state.callReducer,
        contactReducer: state.contactReducer,
        settingReducer: state.settingReducer,
        navigateReducer: state.navigateReducer,
        chatHistoriesReducer: state.chatHistoriesReducer
    };
}
CallHistory = connect(mapStateToProps)(CallHistory);
export default CallHistory;
