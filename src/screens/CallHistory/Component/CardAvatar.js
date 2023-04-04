import React from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { AppText, AppImage } from "components";
import { PD, DEVICE, CHAT_TYPE } from "helper/Consts";
import { Images, FONT_SF, ICON } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import FastImage from "react-native-fast-image";
import I18n from "helper/locales";
import { covertMessage } from "./Functions";
import { Icon } from "native-base";
// import { TouchableOpacity } from "react-native-gesture-handler";
const moment = require("moment");

const HEIGHT =
    DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH < 2 ? DEVICE.DEVICE_HEIGHT * 0.15 : DEVICE.DEVICE_HEIGHT * 0.14;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE;

const compareDate = time => {
    let today = moment().utc(new Date());
    let inToday =
        today.utc().isSame(moment.utc(time), "date") &&
        today.utc().isSame(moment.utc(time), "month") &&
        today.utc().isSame(moment.utc(time), "year");

    if (inToday) {
        return moment
            .utc(time)
            .local()
            .format("HH:mm");
    } else {
        return moment
            .utc(time)
            .local()
            .format("HH:mm   DD/MM/YYYY");
    }
};

const convert = (array, id, time) => {
    return array.filter(el => {
        return el.id != id || (el.id == id && moment(el.time).valueOf() >= moment(time).valueOf());
    });
};

const checkSeen = (array, id, icon) => {
    if (icon != ICON.MISS_CALL) return true;
    let result = false;
    array.map(el => {
        if (el.id == id) {
            result = true;
        }
    });
    return result;
};

const CardAvatar = (
    props = {
        onPress,
        onTouch,
        onPressCall,
        onSeen,
        source,
        user,
        name,
        time,
        callType,
        callSuccess,
        listMissedCallsSeen,
        unread
    }
) => {
    let {
        onPress = () => {},
        onTouch = () => {},
        onPressCall = () => {},
        onSeen = () => {},
        source = Images.IMAGE_TEST,
        user = {},
        name = "",
        time = "",
        callType = "",
        callSuccess = "",
        listMissedCallsSeen = [],
        unread
    } = props;
    let timeShow = compareDate(time);

    // let array = listMissedCallsSeen || [];
    let callTypeText = "";
    let icon = ICON.AWAY_CALL;

    if (callType) {
        if (callSuccess) {
            callTypeText = I18n.t("callDetails.comingCall");
            icon = ICON.INCOMING_CALL;
        } else {
            callTypeText = I18n.t("callDetails.missCall");
            icon = ICON.MISS_CALL;
        }
    } else {
        if (callSuccess) {
            callTypeText = I18n.t("callDetails.awayCall");
        } else {
            callTypeText = I18n.t("callDetails.cancelCall");
        }
    }

    let array = convert(listMissedCallsSeen, user.id, time);
    let seen = checkSeen(array, user.id, icon);
    unread(!seen);
    let param = {
        id: user.id,
        time
    };
    let value = seen ? [] : [...array, param];

    return (
        <View>
            <View style={styles.layer} />
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchableOpacity onPress={() => onTouch(value)} style={styles.leftContent}>
                        <View style={styles.imageOutLine}>
                            <AppImage source={{ uri: source }} style={styles.image} resizeMode="cover" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTouch(value)} style={styles.centerContent}>
                        <View style={{ height: WIDTH_M * 0.18, justifyContent: "space-between" }}>
                            <AppText text={name} style={[styles.groupName, !seen && { color: Colors.RED_COLOR }]} />
                            <View style={styles.groupMessageWrap}>
                                <AppImage
                                    local
                                    source={icon}
                                    style={[styles.icon, icon != ICON.MISS_CALL ? null : { height: 8 }]}
                                    resizeMode="contain"
                                />
                                <AppText
                                    text={callTypeText}
                                    style={[styles.groupMessage, !seen && { color: Colors.RED_COLOR }]}
                                />
                            </View>
                            <View style={styles.groupMessageWrap}>
                                <Icon name="time" style={[styles.iconNB, !seen && { color: Colors.RED_COLOR }]} />
                                <AppText
                                    text={timeShow}
                                    style={[styles.groupMessage, !seen && { color: Colors.RED_COLOR }]}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.rightContent}>
                        <View style={{ height: OUTLINE_SIZE }}>
                            <TouchableOpacity onPress={() => onPressCall(false)} style={styles.timeWrap}>
                                <AppImage
                                    local
                                    source={ICON.PHONE_BLUE}
                                    style={styles.phoneImage}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rightContent}>
                        <View style={{ height: OUTLINE_SIZE }}>
                            <TouchableOpacity onPress={() => onPressCall(true)} style={styles.timeWrap}>
                                <AppImage
                                    local
                                    source={ICON.IC_VIDEO_CALL_BLUE}
                                    style={styles.phoneImage}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = {
    container: {
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        backgroundColor: Colors.CONTENT_COLOR
    },
    content: {
        marginLeft: PD.PADDING_4,
        flexDirection: "row",
        borderBottomWidth: 1.5,
        borderColor: Colors.WHITE_COLOR
    },
    imageOutLine: {
        height: OUTLINE_SIZE,
        width: OUTLINE_SIZE,
        borderRadius: WIDTH_M * 0.09,
        padding: 8,
        backgroundColor: "rgba(255,255,255,0.5)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    image: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        overflow: "hidden"
    },
    phoneImage: {
        height: 19,
        width: 19
    },
    groupNameWrap: {
        // height: OUTLINE_SIZE * 0.3,
        // flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    groupName: {
        fontSize: responsiveFontSize(2.4),
        lineHeight: responsiveFontSize(3.1),
        fontFamily: FONT_SF.MEDIUM,
        color: Colors.BLACK_TEXT_COLOR
        // justifyContent: "flex-end"
        // flex: 1
    },
    groupMessageWrap: {
        // flex: 1.5,
        // height: OUTLINE_SIZE * 0.6,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
        // paddingTop: Platform.OS == "ios" ? 4 : 0
    },
    groupMessage: {
        // height: 50,
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveFontSize(2.8),
        fontFamily: FONT_SF.REGULAR,
        color: "#999999"
        // justifyContent: "flex-start"
        // flex: 1
    },
    leftContent: {
        width: WIDTH_M * 0.18,
        justifyContent: "center",
        lignItems: "flex-start",
        height: HEIGHT
    },
    centerContent: {
        width: WIDTH_M * 0.6,
        height: HEIGHT,
        justifyContent: "center",
        paddingLeft: PD.PADDING_4
    },
    rightContent: {
        width: WIDTH_M * 0.11,
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
        // height: HEIGHT * 0.3,
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20
    },
    time: {
        fontSize: responsiveFontSize(1.8),
        color: Colors.MAIN_COLOR
    },
    badgetText: {
        color: Colors.WHITE_COLOR
    },
    icon: {
        height: 14,
        width: 14,
        marginRight: 10
    },
    iconNB: {
        fontSize: responsiveFontSize(2.2),
        marginRight: 10,
        color: "#999999"
    },
    layer: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: -2,
        backgroundColor: Colors.CONTENT_COLOR
    }
};

export default CardAvatar;
