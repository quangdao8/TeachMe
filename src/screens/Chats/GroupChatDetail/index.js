import React from "react";
import { connect } from "react-redux";
import { FlatList, View, TextInput, Alert, Keyboard, TouchableOpacity } from "react-native";
import { Icon, Spinner } from "native-base";
import _ from "lodash";

import { HeaderApp, AppText, Button } from "components";
import styles from "./styles";
import CardUserChat from "./Component/CardUserChat";
import I18n from "helper/locales";
import { Colors, Const } from "helper";
import { changeNameGroupChat, leaveGroupChat } from "actions/chat/chatHistoriesAction";
import { alertActions } from "actions";
import ModalGroupSelect from "../ChatHistories/Component/ModalGroupSelect";
import firebase from "@react-native-firebase/database";
import chatFn from "../Chat/Functions";
import { CHAT_TYPE, DEVICE, PD, DIMENSION, GROUP_TYPE, USER_TYPE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const moment = require("moment");
const hitSlop = { top: 10, left: 10, right: 10, bottom: 10 };

class GroupChatDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        const chatRoomInfo = props.navigation.getParam("chatRoomInfo");
        const roomId = chatRoomInfo.id;
        const chatRoomInfoProps = props.chatRoomInfoProps ? props.chatRoomInfoProps : chatRoomInfo;
        this.state = {
            nameGroup: chatRoomInfoProps.name,
            chatRoomInfo: chatRoomInfo,
            spiner: false,
            chatRoomInfoProps
            // user: chatRoomInfoProps.users
        };
        // this.state.chatRoomInfo = chatRoomInfo;
        this.refChannel = firebase.database().ref(`/chat-group/${roomId}`);
    }

    componentDidUpdate(prevProps) {
        const { chatHistoriesReducer } = this.props;
        if (prevProps.chatHistoriesReducer != chatHistoriesReducer) {
            this.setState({ chatRoomInfo: chatHistoriesReducer.currentRoom });
        }
    }

    renderItem(item, index) {
        // const { chatRoomInfo } = this.state;
        const { contactReducer, navigation, userReducer } = this.props;
        // const { users } = chatRoomInfo;
        // const checkMe = _.findIndex(users, function(o) {
        //     return o.about_user.id == userReducer.data.id;
        // });
        return (
            <CardUserChat
                dataUser={userReducer}
                navigation={navigation}
                item={item}
                disable={item.id == userReducer.data.id}
                contactReducer={contactReducer.data.response}
                chat
            />
        );
    }

    onChangeNameGroup() {
        Keyboard.dismiss();
        this.setState({ spiner: true }, async () => {
            const { nameGroup, chatRoomInfo } = this.state;
            const { dispatch } = this.props;
            const { id } = chatRoomInfo;
            const body = { name: nameGroup };
            const response = await changeNameGroupChat(id, body);

            if (response.error) {
                setTimeout(() => {
                    this.setState({ spiner: false }, () => {
                        paramsAlert = {
                            content: I18n.t("Alert.changeNameChatError"),
                            title: I18n.t("Alert.notice"),
                            type: Const.ALERT_TYPE.ERROR
                        };
                        dispatch(alertActions.openAlert(paramsAlert));
                    });
                }, 500);
            } else {
                setTimeout(() => {
                    this.setState({ spiner: false }, () => {
                        paramsAlert = {
                            content: I18n.t("Alert.changeNameChatSuccess"),
                            title: I18n.t("Alert.notice"),
                            type: Const.ALERT_TYPE.SUCCESS
                        };
                        this.sendSystemMessageToRoom(CHAT_TYPE.CHANGE_NAME, []);
                        dispatch(alertActions.openAlert(paramsAlert));
                    });
                }, 500);
            }
        });
    }

    onAddMemberSuccess(memberInfo) {
        const { dispatch } = this.props;
        this.setState({ isVisible: false }, () => {
            setTimeout(() => {
                let paramsAlert = {};
                paramsAlert = {
                    content: I18n.t("Alert.addMemberSuccess"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.SUCCESS
                };
                dispatch(alertActions.openAlert(paramsAlert));
                this.sendSystemMessageToRoom(CHAT_TYPE.ADD_MEMBER, memberInfo);
            }, 500);
        });
    }

    onAddMemberFailed() {
        const { dispatch } = this.props;
        setTimeout(() => {
            let paramsAlert = {};
            paramsAlert = {
                content: I18n.t("Alert.addMemberError"),
                title: I18n.t("Alert.notice"),
                type: Const.ALERT_TYPE.ERROR
            };
            dispatch(alertActions.openAlert(paramsAlert));
        }, 50);
    }

    onCreatedRoomError() {
        const { dispatch } = this.props;
        const paramsAlert = {};
        dispatch(alertActions.openAlert(paramsAlert));
    }

    convertMember(member) {
        let result = "";
        for (const i in member) {
            if (i < member.length - 1) {
                result += `${member[i]}, `;
            } else {
                result += `${member[i]}`;
            }
        }
        return result;
    }

    sendSystemMessageToRoom(type, memberInfo) {
        const { userReducer } = this.props;
        const user = chatFn.converUser(userReducer.data);
        const userDetail = userReducer.data.user;
        const name = `${userDetail.first_name} ${userDetail.last_name}`;
        this.refChannel
            .limitToLast(1)
            .once("value")
            .then(data => {
                // TODO: GET LAST MESSAGE INDEX
                let last_message_index = 0;
                if (!_.isEmpty(data.toJSON())) {
                    const item = Object.values(data.toJSON());
                    last_message_index = chatFn.deCryptMessage(item[0]).index;
                }

                let systemMess = "";
                switch (type) {
                    case CHAT_TYPE.CHANGE_NAME:
                        systemMess = chatFn.convertSystemMessage(name, user, last_message_index);
                        this.sendTofirebase(systemMess);
                        break;
                    case CHAT_TYPE.ADD_MEMBER:
                        const member = this.convertMember(memberInfo);
                        systemMess = chatFn.convertSystemAddMember(name, user, last_message_index, member);
                        this.sendTofirebase(systemMess);
                        break;
                    case CHAT_TYPE.CREATE_ROOM:
                        systemMess = chatFn.convertSystemCreateRoom(name, user, last_message_index, member);
                        this.sendTofirebase(systemMess);
                        break;
                    case CHAT_TYPE.LEAVE_ROOM:
                        systemMess = chatFn.convertSystemLeaveRoom(name, user, last_message_index, member);
                        this.sendTofirebase(systemMess);
                        break;
                    default:
                        break;
                }
            });
    }

    sendTofirebase(systemMess) {
        let param = chatFn.enCryptMessage(systemMess[0]);
        this.refChannel
            .push(param)
            .then(data => {
                const item = Object.values(data.toJSON());
            })
            .catch(error => console.log("error", error));
    }

    addMember() {
        const { isVisible } = this.state;
        this.setState({ isVisible: !isVisible });
    }

    renderGroupName() {
        const { nameGroup } = this.state;
        const { chatRoomInfoProps } = this.state;
        const { userReducer } = this.props;
        const defaultName = chatRoomInfoProps.name;
        const disabled = defaultName == nameGroup || _.isEmpty(nameGroup);
        return (
            <View style={styles.inputContainer}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    <View style={styles.inputWrap}>
                        <TextInput
                            value={nameGroup}
                            onChangeText={e => this.setState({ nameGroup: e })}
                            style={styles.input}
                            placeholder={I18n.t("chat.namegroupPH")}
                        />
                    </View>
                    <TouchableOpacity disabled={disabled} hitSlop={hitSlop} onPress={() => this.onChangeNameGroup()}>
                        <Icon
                            name="ios-checkmark"
                            style={[styles.iconStyle, { color: disabled ? Colors.DIABLED_BUTTON : Colors.MAIN_COLOR }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    async onLeaveGroup() {
        const { chatRoomInfo } = this.state;
        const { userReducer, dispatch, navigation } = this.props;
        const { id } = chatRoomInfo;
        const userId = userReducer.data.id;
        const response = await leaveGroupChat(id, userId);
        if (response.error) {
            const paramsAlert = {
                content: I18n.t("Alert.leaveGroupChatError"),
                title: I18n.t("Alert.notice"),
                type: Const.ALERT_TYPE.ERROR
            };
            dispatch(alertActions.openAlert(paramsAlert));
        } else {
            let createdAt = moment.utc().valueOf();
            this.sendSystemMessageToRoom(CHAT_TYPE.LEAVE_ROOM, []);
            firebase
                .database()
                .ref(`/user-update-message/${userId}`)
                .push({ createdAt })
                .then(data => {
                    navigation.navigate("ChatHistories");
                })
                .catch(error => {
                    console.log("error ", error);
                });
        }
    }

    showAlertLeave() {
        Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.askLeaveGroup"), [
            {
                text: I18n.t("Alert.cancel"),
                style: "cancel"
            },
            { text: "OK", onPress: () => this.onLeaveGroup() }
        ]);
    }

    render() {
        const { isVisible, chatRoomInfo, chatRoomInfoProps } = this.state;
        const { navigation, userReducer } = this.props;
        const { users } = chatRoomInfo;

        return (
            <View style={styles.container}>
                <HeaderApp navigation={navigation} title={I18n.t("chat.detailGroup")} isBack />
                <View style={styles.wrapInner}>
                    {userReducer.data.type == USER_TYPE.TEACHER && (
                        <AppText text={I18n.t("chat.nameGroup")} style={styles.title} />
                    )}
                    {userReducer.data.type == USER_TYPE.TEACHER && this.renderGroupName()}
                    <View>
                        <View style={styles.memberWrap}>
                            <AppText text={I18n.t("chat.member")} style={styles.title} />
                            {userReducer.data.type == 1 && (
                                <TouchableOpacity onPress={() => this.addMember()}>
                                    <View style={styles.addMemberWrap}>
                                        <AppText text={I18n.t("chat.addMember")} style={styles.titleMain} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ height: DEVICE.DEVICE_HEIGHT * 0.55 }}>
                            <FlatList
                                data={users ? users : []}
                                renderItem={({ item, index }) => this.renderItem(item, index)}
                                keyExtractor={(item, index) => `${index}`}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ width: "100%", height: DIMENSION.BUTTON_HEIGHT, justifyContent: "center", flex: 1 }}>
                    <Button
                        style={{ backgroundColor: "firebrick" }}
                        title={I18n.t("chat.leaveGroup").toUpperCase()}
                        onPress={() => this.showAlertLeave()}
                        tStyle={{ fontSize: responsiveFontSize(2) }}
                    />
                </View>
                <ModalGroupSelect
                    chatRoomInfo={chatRoomInfo}
                    member={users}
                    isVisible={isVisible}
                    leftOnPress={() => this.addMember()}
                    onAddMemberSuccess={memberInfo => this.onAddMemberSuccess(memberInfo)}
                    onCreatedRoomError={() => this.onCreatedRoomError()}
                    onAddMemberFailed={() => this.onAddMemberFailed()}
                />
                {this.state.spiner ? (
                    <View style={styles.spinnerWrap}>
                        <Spinner color={Colors.WHITE_COLOR} size="small" />
                    </View>
                ) : null}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        contactReducer: state.contactReducer,
        chatRoomInfoProps: state.chatHistoriesReducer.currentRoom,
        chatHistoriesReducer: state.chatHistoriesReducer
    };
}
GroupChatDetail = connect(mapStateToProps)(GroupChatDetail);
export default GroupChatDetail;
