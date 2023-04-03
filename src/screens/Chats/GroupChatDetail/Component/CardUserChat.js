import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText, AppImage } from "components";
import { PD, DEVICE } from "helper/Consts";
import { Images, FONT_SF, ICON } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";

const _ = require("lodash");

const HEIGHT = DEVICE.DEVICE_HEIGHT * 0.13;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 8;

const CardContact = (
    props = {
        onPress,
        source,
        online,
        groupName,
        lastMessage,
        time,
        unreadMessage,
        item,
        navigation,
        disable,
        dataUser
    }
) => {
    let { item = {}, contactReducer = [], navigation, disable = false, dataUser } = props;
    const detailUser = _.filter(contactReducer, { about_user: { id: item.id } });
    const nickname = _.isEmpty(detailUser) ? item.user.first_name + " " + item.user.last_name : detailUser[0].nickname;
    return (
        <TouchableOpacity
            onPress={() =>
                dataUser.data.type == 0
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
                      })
            }
            style={styles.container}
            disabled={disable}
        >
            <View style={styles.content}>
                <View style={styles.leftContent}>
                    <View style={styles.imageOutLine}>
                        <AppImage source={{ uri: item.avatar }} style={styles.image} resizeMode="cover" />
                    </View>
                </View>
                <View style={styles.centerContent}>
                    <View>
                        <View style={styles.groupName}>
                            <AppText numberOfLines={1} text={nickname} style={styles.txtName} />
                            {item.type == 0 && (
                                <AppImage local resizeMode="contain" source={ICON.STUDENT} style={styles.icApp} />
                            )}
                            {item.type == 1 && (
                                <AppImage local resizeMode="contain" source={ICON.TEACHER} style={styles.icApp} />
                            )}
                        </View>
                        <AppText text={item.user.username} style={styles.groupMessage} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = {
    container: {
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        // backgroundColor: "red"
        backgroundColor: Colors.CONTENT_COLOR
    },
    content: {
        marginLeft: PD.PADDING_4,
        flexDirection: "row"
    },
    imageOutLine: {
        height: OUTLINE_SIZE,
        width: OUTLINE_SIZE,
        borderRadius: WIDTH_M * 0.09,
        padding: 8,
        backgroundColor: "rgba(255,255,255,0.5)",
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2
    },

    txtName: {
        fontSize: responsiveFontSize(2.3),
        fontFamily: FONT_SF.MEDIUM,
        color: Colors.BLACK_TEXT_COLOR,
        width: WIDTH - AVATAR_SIZE - OUTLINE_SIZE - 80
    },

    groupMessage: {
        fontSize: responsiveFontSize(2),
        fontFamily: FONT_SF.REGULAR,
        color: "#999999"
    },
    leftContent: {
        width: WIDTH_M * 0.2,
        justifyContent: "center",
        lignItems: "flex-start",
        height: HEIGHT
    },
    centerContent: {
        width: WIDTH_M * 0.7,
        height: HEIGHT,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: Colors.WHITE_COLOR,
        flexDirection: "row",
        alignItems: "center"
    },
    rightContent: {
        width: WIDTH_M * 0.15,
        height: HEIGHT,
        alignItems: "center",
        justifyContent: "center"
    },

    badget: {
        backgroundColor: Colors.MAIN_COLOR,
        height: 25,
        width: 25,
        borderRadius: 12.5,
        alignItems: "center",
        justifyContent: "center"
    },
    timeWrap: {
        height: HEIGHT * 0.3,
        justifyContent: "flex-end",
        alignItems: "flex-start"
    },
    time: {
        fontSize: responsiveFontSize(1.8),
        color: Colors.MAIN_COLOR
    },
    badgetWrap: {
        height: HEIGHT * 0.6,
        justifyContent: "center",
        alignItems: "center"
    },
    badgetText: {
        color: Colors.WHITE_COLOR
    },
    onlineDotOutline: {
        padding: 4,
        position: "absolute",
        height: 16,
        width: 16,
        borderRadius: 9,
        bottom: 0,
        right: AVATAR_SIZE * 0.1,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },
    offlineDotOutline: {
        padding: 4,
        position: "absolute",
        height: 16,
        width: 16,
        borderRadius: 9,
        bottom: 0,
        right: AVATAR_SIZE * 0.1,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },
    icApp: {
        width: 60,
        height: 30,

        marginRight: 10
    },
    groupName: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: WIDTH - AVATAR_SIZE - OUTLINE_SIZE,
        alignItems: "center",
        height: 40
    }
};

export default CardContact;
