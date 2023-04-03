import React from "react";
import {
    View,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Keyboard,
    Platform,
    ActivityIndicator,
    AsyncStorage,
    Linking,
    Modal
} from "react-native";
import { connect } from "react-redux";
import { Fab } from "native-base";
import { Const, Colors, Convert } from "../../../helper/index";
import { types, localNotificationActions, chatHistoriesAction } from "actions/index";
import { Container, AppImage, AppText, Button, LocalNotification } from "components/index";
import styles from "./styles";
import { ICON, FONT_SF, Images } from "assets";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import CardContact from "./CardContact";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { getContactRequest, sendFavoriteRequest, syncContactSuccess, getTeacherRequest } from "actions/contactActions";
// import { responsiveFontSize } from "react-native-responsive-dimensions";
// import Contacts from "react-native-contacts";
// import { PermissionsAndroid, Platform } from "react-native";
// import FastImage from "react-native-fast-image";
import { nospecial, characters } from "./data";
// import { PD, DIMENSION, DEVICE } from "helper/Consts";
// import { topicRequest, specializeRequest, positionRequest } from "actions/tNsActions";
import firebase from "@react-native-firebase/database";
// import { FloatingAction } from "react-native-floating-action";
import CardTeacher from "./CardTeacher";
import {
    topicRequest,
    specializeRequest,
    positionRequest,
    schoolRequest,
    masterSettingRequest
} from "actions/tNsActions";
import { switchOnlineStatus } from "actions/settingActions";
import { USER_TYPE, DEVICE, GROUP_TYPE } from "helper/Consts";
import { getListFavoriteTeacherRequest } from "actions/favoriteAction";
import { getContactAppRequest } from "actions/allContactAppAction";
import { alertActions } from "actions";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const _ = require("lodash");
const moment = require("moment");

class ListUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            userName: "",
            error: "",
            active: false,
            loading: false,
            groupData: [],
            teacherData: [],
            favoriteData: [],
            backupData: [],
            refresh: false,
            tabs: props.userReducer.data.type == USER_TYPE.STUDENT,
            initialRender: 1,
            page: 1,
            keyboardHeight: 10,
            footer: false,
            isSearch: true,
            onlineStatus: []
        };
        this.inputRefs = {};
        this.deviceContact = [];
        this.valueSearch = "";
        this.teacher = false;
        this.getOnlineStatusFirst = false;
        this.myDb = firebase().ref(`video-call/${props.userReducer.data.id}`);
        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
        // this.props.userReducer.data.type == USER_TYPE.STUDENT && this.props.dispatch(switchOnlineStatus(true));
    }

    // componentWillMount() {
    //     this.onGetListFavor();
    // }

    // onGetListFavor() {
    //     const { dispatch, userReducer } = this.props;
    //     let params = {
    //         user__id: userReducer.data.id,
    //         is_liked: true
    //     };
    //     dispatch(getListFavoriteTeacherRequest(params));
    // }

    componentDidMount() {
        const { type } = this.props.userReducer.data;
        // const { contactReducer } = this.props;
        // let { localContact } = contactReducer;
        // if (!_.isEmpty(localContact)) {
        //     //   let contact = [...localContact];
        //     let contact = [...contactReducer.data.response]
        //     //   contact.push(...contactReducer.data.response);
        //     const data = this.divideGroupArray(contact);
        //     this.setState({ groupData: data, backupData: contact, initialRender: contact.length }, () => {
        //         this.onRefresh();
        //     });
        // } else {
        // setTimeout(() => {
        type == USER_TYPE.TEACHER ? this.onRefresh() : this.onLoading();
        this.getOnlineStatusTeacher();

        // }, 200);
        // }
    }

    getOnlineStatus() {
        const { userReducer, dispatch } = this.props;
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        const { languageReducer = {} } = this.props;
        const { language = "vi" } = languageReducer;
        let params = {
            language: language,
            id: userReducer.data.id,
            status: true,
            onlineStatusTime: createdAt,
            platform: Platform.OS
        };
        let storageKey = "VOIP_TOKEN";
        if (Platform.OS !== "ios") {
            storageKey = "DEVICE_TOKEN";
        }
        AsyncStorage.getItem(Const.LOCAL_STORAGE[storageKey])
            .then(voip => {
                console.log('=========----------', voip);
                if (voip) {
                    params.voip = voip;
                }
                firebase()
                    .ref(`/status/`)
                    .orderByChild("id")
                    .endAt(userReducer.data.id)
                    .limitToLast(1)
                    .once("value", childSnapshot => {
                        this.getOnlineStatusFirst = true;
                        const message = childSnapshot.toJSON();
                        let value = message ? Object.values(message) : "";
                        console.log('==============', value);
                        if (_.isEmpty(value) || value[0].id != userReducer.data.id) {
                            dispatch(switchOnlineStatus(true));
                            firebase()
                                .ref(`/status/`)
                                .push(params);
                            return;
                        }
                        // if (userReducer.data.type == USER_TYPE.STUDENT) return;
                        if (!_.isEmpty(value)) {
                            const key = Object.keys(message);
                            !value[0].status && this.notiRef.openNoti("", I18n.t("Alert.switchOffline"));

                            params.status = value[0].status;
                            firebase()
                                .ref(`/status/${key}`)
                                .update(params);
                            dispatch(switchOnlineStatus(value[0].status));
                        }
                    });
            })
            .catch(e => {
                console.log("error", e);
            });
    }

    getOnlineStatusTeacher() {
        const { userReducer } = this.props;
        if (userReducer.data.type == USER_TYPE.TEACHER) return;

        firebase()
            .ref(`/status/`)
            .on("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                this.setState({ onlineStatus: value || [] });
            });
    }

    componentDidUpdate(prevProps) {
        // let deviceContact = [];
        const { contactReducer, settingReducer } = this.props;
        let { localContact } = contactReducer;
        if (prevProps.contactReducer !== contactReducer) {
            if (contactReducer.type === types.ADD_SUCCESS) {
                this.onRefresh();
                return;
            }
            if (contactReducer.type === types.DELETE_CONTACT_SUCCESS) {
                this.onRefresh();
                return;
            }
            if (contactReducer.type === types.EDIT_CONTACT_LOCAL) {
                this.processContact();
                return;
            }
            // this.setState({ refresh: false }, () => {
            //     if (contactReducer.type === types.GET_CONTACT_SUCCESS) {
            //         alert("aaaa")
            //         this.processContact();
            //     }
            // });

            if (contactReducer.type === types.GET_CONTACT_SUCCESS) {
                console.log('===============', contactReducer.type);
                this.teacher = true;
                this.getTNS();
                this.processContact();
                return;
            }
            if (contactReducer.type === types.GET_CONTACT_FAILED) {
                this.teacher = true;
                // this.getTNS();
                this.setState({ refresh: false });
                return;
            }
            if (contactReducer.type === types.GET_TEACHER_SUCCESS) {
                console.log('===============', !this.getContact);

                if (!this.getContact) {
                    this.getContact = true;
                    this.onRefresh();
                }
                // this.getTNS();
                this.setState({ loading: false, footer: false, teacherData: contactReducer.dataTeacher.results });
                return;
            }
            if (contactReducer.type === types.GET_TEACHER_FAILED) {
                this.setState({ loading: false, footer: false });
                return;
            }
            // if (contactReducer.type === types.SEND_FAVORITE_SUCCESS) {
            //     this.setState({ loading: false, favoriteData: contactReducer.dataFavorite.response });
            //     this.teacher = true;
            //     return;
            // }
            // if (contactReducer.type === types.SEND_FAVORITE_FAILED) {
            //     this.setState({ loading: false });
            //     this.teacher = true;
            //     return;
            // }
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = e => {
        this.setState({
            keyboardHeight: e.endCoordinates.height + 10 - 55
        });
    };

    _keyboardDidHide = () => {
        this.setState({ keyboardHeight: 10 });
    };

    getTNS() {
        const { tNsReducer, dispatch } = this.props;
        if (this.getOnlineStatusFirst) return;
        // if (
        //     !_.isEmpty(tNsReducer.dataTopic) &&
        //     !_.isEmpty(tNsReducer.dataSpecialize) &&
        //     !_.isEmpty(tNsReducer.dataPosition) &&
        //     !_.isEmpty(tNsReducer.dataSchool)
        // )
        //     return;
        setTimeout(() => {
            this.getOnlineStatus();
            dispatch(getContactAppRequest());
            dispatch(topicRequest("topic"));
            dispatch(specializeRequest("specialize"));
            dispatch(positionRequest("job_position"));
            dispatch(schoolRequest("school"));
            dispatch(masterSettingRequest("masterSetting"));
        }, 200);
    }

    renderItem(item, index) {
        return <CardContact key={index} item={item} navigation={this.props.navigation} />;
    }

    divideGroupArray(data) {
        const { userReducer } = this.props;
        let groups = [];
        let empty = true;

        characters.map(c => {
            let sameCharatersGroup = [];
            data.map(user => {
                if (_.isEmpty(user.nickname)) {
                    return;
                }
                let covertFirst = Convert.removeDiacritics(user.nickname[0].toLowerCase());
                if (covertFirst == c) {
                    if (userReducer.data.type == 1 || (userReducer.data.type == 0 && user.about_user.type == 0))
                        sameCharatersGroup.push(user);
                } else {
                    if (c == "#") {
                        if (!_.includes(nospecial, covertFirst)) {
                            if (userReducer.data.type == 1 || (userReducer.data.type == 0 && user.about_user.type == 0))
                                sameCharatersGroup.push(user);
                        }
                    }
                }
            });
            !_.isEmpty(sameCharatersGroup) ? (empty = false) : null;
            groups.push(sameCharatersGroup);
        });
        return empty ? [] : groups;
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
                {groups.map((user, index) => {
                    return this.renderItem(user, index);
                })}
            </View>
        );
    }

    processContact() {
        const { contactReducer, dispatch } = this.props;
        if (_.isEmpty(this.valueSearch)) {
            let contact = contactReducer.data.response ? [...contactReducer.data.response] : [];
            // const data = await this.divideGroupArray(contact)
            this.setState(
                {
                    groupData: this.divideGroupArray(contact),
                    backupData: contact,
                    initialRender: contact.length
                },
                () => {
                    this.setState({ refresh: false });
                }
            );
        } else {
            this.onSearch(this.valueSearch);
        }
    }

    // async getContact() {
    //     let deviceContact = [];
    //     return new Promise(async (resolve, reject) => {
    //         if (Platform.OS == "android") {
    //             const requestPermisstion = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    //                 {
    //                     title: "Contacts",
    //                     message: "This app would like to view your contacts."
    //                 }
    //             );

    //             if (requestPermisstion == PermissionsAndroid.RESULTS.GRANTED) {
    //                 this.setState({ loading: true }, () => {
    //                     Contacts.getAll((err, contacts) => {
    //                         if (err === "denied") {
    //                         } else {
    //                             for (let i in contacts) {
    //                                 let nickname = `${contacts[i].givenName} ${
    //                                     contacts[i].familyName ? contacts[i].familyName : ""
    //                                 }`;
    //                                 let phone_number = _.isEmpty(contacts[i].phoneNumbers[0])
    //                                     ? ""
    //                                     : contacts[i].phoneNumbers[0].number;
    //                                 let params = {
    //                                     about_user: {
    //                                         phone_number
    //                                     },
    //                                     nickname: nickname.trim()
    //                                 };
    //                                 deviceContact.push(params);
    //                             }
    //                             resolve(deviceContact);
    //                         }
    //                     });
    //                 });
    //             } else {
    //                 resolve(deviceContact);
    //             }
    //         } else {
    //             this.setState({ loading: true }, () => {
    //                 Contacts.getAll((err, contacts) => {
    //                     if (err == "denied") {
    //                         resolve(deviceContact);
    //                     } else {
    //                         for (let i in contacts) {
    //                             let givenName = contacts[i].givenName;
    //                             let middleName = contacts[i].middleName ? ` ${contacts[i].middleName}` : "";
    //                             let familyName = contacts[i].familyName ? ` ${contacts[i].familyName}` : "";
    //                             let nickname = givenName + middleName + familyName;

    //                             let phone_number = _.isEmpty(contacts[i].phoneNumbers[0])
    //                                 ? ""
    //                                 : contacts[i].phoneNumbers[0].number;
    //                             let params = {
    //                                 about_user: {
    //                                     phone_number
    //                                 },
    //                                 nickname: nickname.trim()
    //                             };
    //                             deviceContact.push(params);
    //                         }

    //                         resolve(deviceContact);
    //                     }
    //                 });
    //             });
    //         }
    //     });
    // }

    onSearch(value) {
        let { backupData } = this.state;

        if (!_.isEmpty(value.trim())) {
            let removeDiacritics = Convert.removeDiacritics(value.trim()).toLowerCase();
            this.valueSearch = removeDiacritics;
            let mainData = [];
            for (let i in backupData) {
                const nickname = Convert.removeDiacritics(backupData[i].nickname).toLowerCase();
                const phone_number = Convert.removeDiacritics(backupData[i].about_user.phone_number).toLowerCase();
                if (!_.isEmpty(backupData[i].about_user.phone_number.toLowerCase())) {
                    if (_.includes(nickname, removeDiacritics) || _.includes(phone_number, removeDiacritics)) {
                        mainData.push(backupData[i]);
                    }
                }
            }
            this.setState({ groupData: this.divideGroupArray(mainData) }, () => {
                this.setState({ refresh: false });
            });
        } else {
            this.valueSearch = "";
            this.setState({ groupData: this.divideGroupArray(backupData) }, () => {
                this.setState({ refresh: false });
            });
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
                                this.state.groupData.length > 0 &&
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
        // dispatch(localNotificationActions.openNotification("something"));
    }

    onRefresh() {
        this.setState({ refresh: true }, () => {
            this.loadGroup();
        });
        // this.forceUpdate();
    }

    onLoading() {
        const { dispatch, userReducer } = this.props;
        // let params = {
        //     of_user__id: userReducer.data.id
        // };
        let params = {
            type: 1,
            search: this.valueSearch
        };
        this.setState({ loading: true }, () => {
            // userReducer.data.type == 1
            //     ? dispatch(sendFavoriteRequest(params))
            //     :
            dispatch(getTeacherRequest(params));
            this.setState({ page: 1 });
        });
    }

    onContact() {
        this.setState({ tabs: false, isSearch: false }, () => {
            // setTimeout(() => {
            //     !this.teacher && this.onRefresh();
            // }, 100);
        });
    }

    onLike() {
        this.setState({ tabs: true, isSearch: false });
    }

    onTabs() {
        const { userReducer } = this.props;
        const { tabs } = this.state;
        const type = userReducer.data.type;
        return type ? (
            <View style={{ height: Const.PD.PADDING_3 }}>
                {/* <TouchableOpacity
                    disabled={true}
                    style={[
                        styles.btnContact,
                        {
                            backgroundColor: Colors.MAIN_COLOR,
                            borderRadius: 10
                        }
                    ]}
                    onPress={() => this.onContact()}
                >
                    <AppText text="Danh bạ" style={{ fontSize: 15, color: tabs ? "#000" : "#fff" }} />
                </TouchableOpacity> */}
            </View>
        ) : (
            <View style={styles.btnTabs}>
                <TouchableOpacity
                    style={[
                        styles.btnContact,
                        {
                            backgroundColor: tabs ? "white" : Colors.MAIN_COLOR
                        }
                    ]}
                    onPress={() => this.onContact()}
                >
                    <AppText
                        text={I18n.t("ListUserScreen.contact")}
                        style={{ fontSize: 15, color: tabs ? "#000" : "#fff" }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.btnLike,
                        {
                            backgroundColor: tabs ? Colors.MAIN_COLOR : "white"
                        }
                    ]}
                    onPress={() => this.onLike()}
                >
                    <AppText
                        text={userReducer.data.type == 1 ? I18n.t("ListUserScreen.favorite") : I18n.t("tabbar.teacher")}
                        style={[{ fontSize: 15 }, { color: tabs ? "#fff" : "#000" }]}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    onPressRight = async user => {
        const { userReducer, dispatch, navigation } = this.props;
        if (userReducer.data.type === USER_TYPE.STUDENT && !userReducer.data.is_sub) {
            dispatch(alertActions.openModal());
        } else {
            let last_message_time = moment()
                .utc()
                .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
            let params = {
                user_ids: [userReducer.data.id, user.id],
                last_message_time,
                type: GROUP_TYPE.PRIVATE
            };
            dispatch({ type: "REQUEST" });
            let data = await chatHistoriesAction.createdGroupChat(params);
            dispatch({ type: "" });
            if (!data.error) {
                let groupName = user.user.username;
                let avatar = user.avatar;
                let id = data.response.chat_room.id;
                navigation.navigate("Chat", {
                    id,
                    chatRoomInfo: data.response,
                    groupName,
                    avatar
                });
            } else {
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
    };

    renderItemTeacher(item) {
        const { userReducer } = this.props;
        let { onlineStatus } = this.state;
        let data = {
            id: item.id,
            nickname: item.user.first_name + " " + item.user.last_name,
            avatar: item.avatar,
            teacher: item
        };

        let online = true;
        let status = onlineStatus.find(el => {
            return el.id == item.id;
        });
        if (!_.isEmpty(status)) {
            online = status.status;
        }

        // let index = onlineStatus.findIndex(el => {
        //     return el.id == item.id;
        // });
        // let online = true;
        // if (index > 0 && !onlineStatus[index].status) {
        //     online = false;
        // }

        return (
            <CardTeacher
                item={data}
                navigation={this.props.navigation}
                online={online}
                onPressRight={() => this.onPressRight(item)}
                isSub={userReducer.data.is_sub || userReducer.data.type === USER_TYPE.TEACHER}
            />
        );
    }

    renderItemAdder(item) {
        return (
            <View style={{ height: 45 }}>
                {/* <AppText text={item.name + " " + item.phone_number} /> */}
                <View style={styles.contentAdder}>
                    <View style={styles.leftContentAdder}>
                        <View style={styles.imageOutLineAdder}>
                            <AppImage
                                source={item.avatar ? { uri: item.avatar } : Images.DEFAULT_AVATAR}
                                style={styles.imageAdder}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                    <View style={styles.centerContentAdder}>
                        <View>
                            <AppText text={item.name} style={styles.groupNameAdder}>
                                <AppText text={" " + I18n.t("ListUserScreen.sendAdder")} />
                                {/* <AppText text={item.phone_number} style={styles.groupMessageAdder} /> */}
                            </AppText>
                        </View>
                        {/* <AppImage resizeMode="contain" source={ICON.YOLEARN} style={styles.icApp} /> */}
                    </View>
                    <View style={styles.rightContentAdder}>
                        <Button title={I18n.t("ListUserScreen.accept")} style={{ height: 30 }} onPress={() => {}} />
                        <Button
                            title={I18n.t("ListUserScreen.refuse")}
                            style={{ height: 30, backgroundColor: "firebrick" }}
                            onPress={() => {}}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderEmptyContainer() {
        let { loading } = this.state;
        return <AppText text={loading ? "" : I18n.t("ListUserScreen.emptyTeacher")} style={styles.textEmpty} />;
    }
    onEndReachedTeacher(page) {
        let { refresh, loading, footer, tabs } = this.state;
        if (refresh || loading || footer || !tabs) return;
        const { dispatch } = this.props;
        let param = {
            type: 1,
            search: this.valueSearch.toLowerCase(),
            page: page + 1
        };
        this.setState({ page: page + 1, footer: true }, () => {
            dispatch(getTeacherRequest(param));
        });
    }

    renderFooterTeacher() {
        let { footer } = this.state;
        return (
            footer && (
                <View style={{ alignItems: "center", marginTop: Const.PD.PADDING_3, marginBottom: Const.PD.PADDING_1 }}>
                    <View style={{ aspectRatio: 1, borderRadius: 50 }}>
                        <ActivityIndicator size="small" color="black" />
                    </View>
                </View>
            )
        );
    }

    renderTeacher() {
        const { contactReducer } = this.props;
        const { loading, tabs, teacherData, page, keyboardHeight } = this.state;
        let max = contactReducer.dataTeacher ? contactReducer.dataTeacher.numberOfPage : 0;
        return (
            <View style={{ display: !tabs ? "none" : "flex" }}>
                <FlatList
                    data={teacherData}
                    extraData={teacherData}
                    contentContainerStyle={{ paddingBottom: keyboardHeight }}
                    style={{ width: "100%", height: "100%" }}
                    renderItem={({ item }) => this.renderItemTeacher(item)}
                    refreshing={loading}
                    onRefresh={() => this.onLoading()}
                    keyExtractor={(item, index) => `${index}`}
                    ListEmptyComponent={this.renderEmptyContainer()}
                    onEndReached={() => {
                        max > page && this.onEndReachedTeacher(page);
                    }}
                    onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                    ListFooterComponent={this.renderFooterTeacher()}
                />
            </View>
        );
    }

    // renderFavorite() {
    //     const { sendFavoriteReducer } = this.props;
    //     const { loading, tabs, favoriteData, keyboardHeight } = this.state;
    //     return (
    //         <View style={{ display: !tabs ? "none" : "flex" }}>
    //             <FlatList
    //                 data={favoriteData}
    //                 extraData={favoriteData}
    //                 contentContainerStyle={{ paddingBottom: keyboardHeight }}
    //                 style={{ width: "100%", height: "100%" }}
    //                 renderItem={({ item }) => this.renderItemFavorite(item)}
    //                 refreshing={loading}
    //                 onRefresh={() => this.onLoading()}
    //                 keyExtractor={(item, index) => `${index}`}
    //                 ListEmptyComponent={this.renderEmptyContainer()}
    //             />
    //         </View>
    //     );
    // }

    renderEmptyStudent() {
        let { refresh } = this.state;
        return (
            <AppText
                text={
                    !refresh
                        ? this.valueSearch
                            ? I18n.t("ListUserScreen.emptySearch")
                            : I18n.t("ListUserScreen.emptyContact")
                        : ""
                }
                style={styles.textEmpty}
            />
        );
    }

    renderContact() {
        const { tabs, refresh, initialRender, groupData, keyboardHeight } = this.state;
        // const groupsData = this.state.groupData;
        return (
            <View style={{ display: tabs ? "none" : "flex", flex: 1 }}>
                <FlatList
                    initialNumToRender={initialRender}
                    ref={ref => (this.flatlist = ref)}
                    contentContainerStyle={{ paddingBottom: keyboardHeight }}
                    showsVerticalScrollIndicator={false}
                    data={groupData}
                    extraData={groupData}
                    renderItem={({ item, index }) => this.renderGroup(item, index)}
                    keyExtractor={(item, index) => `${index}`}
                    refreshing={refresh}
                    onRefresh={() => this.onRefresh()}
                    ListEmptyComponent={this.renderEmptyStudent()}
                />
                {this.renderCharacter()}
            </View>
        );
    }

    renderListContact() {
        const { userReducer } = this.props;
        return (
            <View style={{ width, flex: 1 }}>
                {this.renderContact()}
                {/* {userReducer.data.type == 1 ? this.renderFavorite() : this.renderTeacher()} */}
                {this.renderTeacher()}
            </View>
        );
    }

    renderFab() {
        const { navigation } = this.props;
        const { tabs, active } = this.state;
        return !tabs ? (
            <Fab
                active={active}
                direction="up"
                style={active ? styles.fabActive : styles.fabInactive}
                containerStyle={{ marginRight: 10, marginBottom: 10 }}
                position="bottomRight"
                onPress={() => navigation.navigate("FindContact")}
            >
                {active ? (
                    <AppImage local source={ICON.BTN_CLOSE} style={{ width: 20, height: 20 }} />
                ) : (
                    <AppImage local source={ICON.PLUS} style={{ width: 20, height: 22 }} />
                )}
            </Fab>
        ) : null;
    }

    renderAdder() {
        let dataAdder = [
            // {
            //     name: "AAA",
            //     phone_number: "0123456789"
            // },
            // {
            //     name: "BBB",
            //     phone_number: "0123456788"
            // },
            // {
            //     name: "CCC",
            //     phone_number: "0123456787"
            // },
            // {
            //     name: "DDD",
            //     phone_number: "0123456786"
            // }
        ];
        return (
            <View style={styles.adderView}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={dataAdder}
                    // contentContainerStyle={{ paddingBottom: 30 }}
                    // style={{ width: "100%", height: "100%" }}
                    renderItem={({ item }) => this.renderItemAdder(item)}
                    // refreshing={refresh}
                    // onRefresh={() => this.onRefresh()}
                    keyExtractor={(item, index) => `${index}`}
                    // ListEmptyComponent={this.renderEmptyContainer()}
                />
            </View>
        );
    }

    rightOnPress() {
        let { tabs, isSearch } = this.state;
        this.setState({ isSearch: true });
        tabs && isSearch && this.onLoading();
    }

    render() {
        const { navigation } = this.props;
        const { isSearch, tabs } = this.state;

        return (
            <Container
                scrollEnabled={false}
                contentContainerStyle={{
                    flex: 1,
                    backgroundColor: Colors.CONTENT_COLOR,
                    alignItems: "flex-start"
                }}
            >
                <HeaderApp
                    isSearch={isSearch}
                    changeTab={true}
                    onChangeText={value => this.onSearch(value)}
                    leftOnPress={() => navigation.navigate("StartLogin")}
                    rightOnPress={() => this.rightOnPress()}
                    navigation={navigation}
                    title={tabs ? I18n.t("ListUserScreen.askTeacher") : I18n.t("ListUserScreen.yoleanTeacher")}
                />
                {this.onTabs()}
                {this.renderAdder()}
                {this.renderListContact()}
                {this.renderFab()}
                <LocalNotification onRef={noti => (this.notiRef = noti)} reminder />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer,
        sendFavoriteReducer: state.sendFavoriteReducer,
        tNsReducer: state.tNsReducer,
        settingReducer: state.settingReducer,
        languageReducer: state.languageReducer
    };
}
ListUser = connect(mapStateToProps)(ListUser);
export default ListUser;
