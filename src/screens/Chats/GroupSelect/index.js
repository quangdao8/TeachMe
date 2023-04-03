import React from "react";
import { View, FlatList, TextInput, Platform } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { Spinner, Icon } from "native-base";

import styles from "./styles";
import CardGroup from "./Component/CardGroup";
import { HeaderApp, AppText } from "components";
import I18n from "helper/locales";
import { chatHistoriesAction } from "actions";
import { Colors, Convert } from "helper";
import { GROUP_TYPE, DIMENSION, PD, USER_TYPE } from "helper/Consts";
import { addMemberToChat } from "actions/chat/chatHistoriesAction";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { nospecial, characters } from "./data";

const moment = require("moment");

class GroupSelect extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            idArray: [props.userReducer.id],
            groupName: "",
            isLoading: false,
            contactState: this.convertContact(),
            errorMess: "",
            spinner: true
        };
        this.contactForSearch = this.convertContact();
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

    convertContact() {
        const { member, contactReducer } = this.props;
        let mainArray = [];
        if (_.isEmpty(member)) {
            mainArray = contactReducer;
        } else {
            for (let i in contactReducer) {
                const index = _.findIndex(member, o => {
                    return o.id == contactReducer[i].about_user.id;
                });
                if (index < 0) {
                    mainArray.push(contactReducer[i]);
                }
            }
        }
        return mainArray;
    }

    onPressGroupCard(id) {
        let { idArray, groupName } = this.state;
        groupName = groupName + " ";
        const index = _.findIndex(idArray, o => {
            return o == id;
        });
        if (index > -1) {
            idArray.splice(index, 1);
        } else {
            idArray.push(id);
        }
        this.setState({ idArray, groupName });
    }

    createdRoom() {
        const { idArray, groupName } = this.state;
        const { onCreatedRoomSuccess = () => {}, onCreatedRoomError = () => {} } = this.props;
        let name = groupName.trim();
        this.setState({ isLoading: true }, async () => {
            let last_message_time = moment()
                .utc()
                .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
            let params = {};
            if (idArray.length == 2) {
                params = _.isEmpty(name)
                    ? { user_ids: idArray, last_message_time, type: GROUP_TYPE.PRIVATE }
                    : { user_ids: idArray, last_message_time, type: GROUP_TYPE.PRIVATE, name };
            } else {
                params = _.isEmpty(name)
                    ? { user_ids: idArray, last_message_time, type: GROUP_TYPE.GROUP }
                    : { user_ids: idArray, last_message_time, type: GROUP_TYPE.GROUP, name };
            }

            let data = await chatHistoriesAction.createdGroupChat(params);

            if (!data.error) {
                this.setState({ isLoading: false }, () => {
                    let chatRoomInfo = data.response;
                    let id = data.response.chat_room.id;
                    onCreatedRoomSuccess(id, chatRoomInfo);
                    // navigation.navigate("Chat", { id, chatRoomInfo: data.response, groupName, avatar });
                });
            } else {
                this.setState({ isLoading: false }, () => {
                    onCreatedRoomError();
                });
            }
        });
    }

    async addMemberToGroup() {
        const { chatRoomInfo, contactReducer, onAddMemberSuccess = () => {} } = this.props;
        const { idArray } = this.state;
        let memberInfo = [];
        let arrSend = [];
        for (let index = 1; index < idArray.length; index++) {
            const element = idArray[index];
            const index = _.findIndex(contactReducer, function(o) {
                return o.about_user.id == element;
            });
            if (index > -1) {
                const { user } = contactReducer[index].about_user;
                const name = user.first_name + " " + user.last_name;
                memberInfo.push(name);
            }
            arrSend.push(element);
        }
        const { id } = chatRoomInfo;
        const body = { user_ids: arrSend, chat_room_id: id };
        const response = await addMemberToChat(id, body);
        if (response.error) {
            onAddMemberFailed();
        } else {
            onAddMemberSuccess(memberInfo);
        }
    }

    rightOnPress() {
        const { member, userReducer } = this.props;
        const { idArray } = this.state;

        if (_.isEmpty(member)) {
            if (idArray.length == 1) {
                // this.setState({ errorMess: I18n.t("chat.needMoreOne") }, () => {
                //     setTimeout(() => {
                //         this.setState({ errorMess: "" });
                //     }, 3000);
                // });
            } else if (idArray.length >= 3) {
                if (userReducer.type == 0) {
                    this.setState({ errorMess: I18n.t("chat.noAuthorities") }, () => {
                        setTimeout(() => {
                            this.setState({ errorMess: "" });
                        }, 3000);
                    });
                } else {
                    this.setState({ errorMess: "" }, () => {
                        this.createdRoom();
                    });
                }
            } else {
                this.createdRoom();
            }
        } else {
            this.addMemberToGroup();
        }
    }

    searchContact(e) {
        const contactReducer = this.contactForSearch;
        this.setState({ searchText: e });
        if (!_.isEmpty(e.trim())) {
            const searchTxt = Convert.removeDiacritics(e.toLowerCase().trim());
            let mainArray = [];
            for (let i in contactReducer) {
                const phoneNumber = contactReducer[i].about_user.phone_number.toLowerCase();
                const nickName = Convert.removeDiacritics(contactReducer[i].nickname.toLowerCase());

                if (_.includes(nickName, searchTxt) || _.includes(phoneNumber, searchTxt)) {
                    mainArray.push(contactReducer[i]);
                }
            }
            this.setState({ contactState: mainArray });
        } else {
            this.setState({ contactState: contactReducer });
        }
    }

    leftOnPress() {
        const { leftOnPress = () => {} } = this.props;
        leftOnPress();
    }

    renderHeader() {
        const { navigation, member } = this.props;
        const { idArray } = this.state;

        const title = _.isEmpty(member) ? I18n.t("header.createGroupChat") : I18n.t("chat.addMember");
        return (
            <HeaderApp
                isBack
                rightTitle={I18n.t("groupSelect.done")}
                rightIcon={idArray.length > 1 ? true : false}
                title={title}
                leftOnPress={() => this.leftOnPress()}
                navigation={navigation}
                statusBar={Platform.OS == "ios" ? true : false}
                rIconStyle={{ fontSize: 40 }}
                rightOnPress={() => this.rightOnPress()}
                headerContainer={Platform.OS == "ios" ? {} : { paddingTop: 0, height: DIMENSION.HEADER_HEIGHT }}
            />
        );
    }

    renderSearchInput() {
        const { searchText, groupName } = this.state;
        return (
            <View style={styles.searchWrap}>
                <Icon
                    color={Colors.WHITE_COLOR}
                    style={{ color: Colors.DIABLED_BUTTON }}
                    type={"MaterialCommunityIcons"}
                    name={"magnify"}
                />
                <TextInput
                    value={searchText}
                    onChangeText={e => this.searchContact(e)}
                    style={styles.searchInput}
                    placeholder={I18n.t("groupSelect.placeholderSearch")}
                    onFocus={this.setState({ groupName: groupName.trim() })}
                />
            </View>
        );
    }

    renderNameInput() {
        const { groupName } = this.state;
        const { member } = this.props;

        if (_.isEmpty(member)) {
            return (
                <View style={styles.inputWrap}>
                    <TextInput
                        // value={groupName}
                        onChangeText={e => this.setState({ groupName: e })}
                        style={styles.inputGroupName}
                        placeholder={I18n.t("groupSelect.placeholder")}
                    />
                </View>
            );
        } else {
            return null;
        }
    }
    renderItem(item, index) {
        const { idArray } = this.state;
        return <CardGroup key={index} item={item} idArray={idArray} onPress={id => this.onPressGroupCard(id)} />;
    }
    renderGroup(groups, indexGroup) {
        if (groups.length === 0) {
            return null;
        }
        return <View>{groups.map((user, index) => this.renderItem(user, index))}</View>;
    }
    renderListContact() {
        const { contactState, idArray } = this.state;
        return (
            <FlatList
                ref={ref => (this.flatlist = ref)}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyExtractor={(item, index) => `${index}`}
                data={this.divideGroupArray(contactState)}
                extraData={contactState}
                renderItem={({ item, index }) => this.renderGroup(item, index)}
            />
        );
    }

    spiner() {
        let { isLoading } = this.state;
        return (
            isLoading && (
                <View style={styles.spinerWrap}>
                    <Spinner color="#000000" />
                </View>
            )
        );
    }

    render() {
        const { errorMess, groupName } = this.state;
        const { idArray } = this.state;
        const { userReducer } = this.props;

        return (
            <View style={styles.container}>
                {this.renderHeader()}
                {!_.isEmpty(errorMess) && (
                    <AppText
                        text={this.state.errorMess}
                        style={{
                            marginVertical: PD.PADDING_2,
                            fontSize: responsiveFontSize(2),
                            color: "firebrick",
                            textAlign: "center"
                        }}
                    />
                )}
                {userReducer.type == USER_TYPE.TEACHER && this.renderNameInput()}
                {this.renderSearchInput()}
                {this.renderListContact()}
                {this.spiner()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer.data.response,
        userReducer: state.userReducer.data
    };
}
GroupSelect = connect(mapStateToProps)(GroupSelect);
export default GroupSelect;
