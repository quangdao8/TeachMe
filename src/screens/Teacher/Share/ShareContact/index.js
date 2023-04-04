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
import firebase from "@react-native-firebase/auth";
import { GROUP_TYPE } from "helper/Consts";

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
            keyboardHeight: 60
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

    async navigateToChat(item) {
        this.setState({ spinner: true });
        const { userReducer, dispatch, navigation } = this.props;
        const contact = navigation.getParam("contact");

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
            const user = chatFn.converUser(userReducer.data);
            const cardContact = chatFn.convertCardContact(contact, user, last_message_index);
            let param = chatFn.enCryptMessage(cardContact[0]);
            this.setState({ spinner: false }, () => {
                firebase
                    .database()
                    .ref(`/chat-group/${chat_room.id}`)
                    .push(param)
                    .then(async response => {
                        let id = data.response.chat_room.id;
                        let params = chatFn.lastMessParam(cardContact[0], id, user, last_message_index).lastMessage;
                        chatHistoriesAction.updateLastMessage(params);
                        navigation.navigate("Chat", { id, chatRoomInfo });
                        setTimeout(() => {
                            this.updateRoomChat(chat_room, cardContact);
                        }, 500);
                    })
                    .catch(error => {
                        console.log(error);
                    });
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
    }

    renderItem(item, index) {
        const { navigation } = this.props;
        return <CardContactShare key={index} item={item} onPress={() => this.navigateToChat(item)} />;
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
        const { contactReducer, dispatch } = this.props;
        if (_.isEmpty(this.valueSearch)) {
            let contact = _.filter(contactReducer.data.response, function(o) {
                return o.about_user.type == 0;
            });
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
