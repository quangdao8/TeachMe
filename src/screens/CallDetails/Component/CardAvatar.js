import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText, AppImage } from "components";
import { PD, DEVICE } from "helper/Consts";
import { FONT_SF, ICON } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import I18n from "helper/locales";
import _ from "lodash";

const moment = require("moment");

const HEIGHT =
    DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH < 2 ? DEVICE.DEVICE_HEIGHT * 0.13 : DEVICE.DEVICE_HEIGHT * 0.12;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_6;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 8;

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
            .format("DD/MM/YYYY   LT");
    }
};

const CardAvatar = (props = { onPressNote, time, callType, duration, note }) => {
    let { onPressNote = () => {}, time = "", callType = "", duration = "", note = "" } = props;
    let timeShow = compareDate(time);

    let callTypeText = "";
    let icon = ICON.AWAY_CALL;
    if (callType) {
        if (duration) {
            callTypeText = I18n.t("callDetails.comingCall");
            icon = ICON.INCOMING_CALL;
        } else {
            callTypeText = I18n.t("callDetails.missCall");
            icon = ICON.MISS_CALL;
        }
    } else {
        if (duration) {
            callTypeText = I18n.t("callDetails.awayCall");
        } else {
            callTypeText = I18n.t("callDetails.cancelCall");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.body}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AppImage
                            local
                            source={icon}
                            style={[styles.icon, icon != ICON.MISS_CALL ? null : { height: 8 }]}
                            resizeMode="contain"
                        />
                        <AppText text={callTypeText} style={[styles.groupName]} />
                    </View>
                    <AppText
                        text={duration ? moment.utc(duration).format("mm:ss") : ""}
                        style={styles.groupMessage}
                    />
                </View>
                <View style={styles.body}>
                    <View style={styles.groupMessageWrap}>
                        <AppImage local source={ICON.CALENDAR_CALL} style={[styles.icon]} resizeMode="cover" />
                        <AppText text={timeShow} style={[styles.groupMessage]} />
                    </View>
                    {!_.isEmpty(note) && (
                        <TouchableOpacity style={{ padding: 4 }} onPress={() => onPressNote(note)}>
                            <AppImage local source={ICON.NOTE_CALL} style={[styles.iconNote]} resizeMode="cover" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = {
    container: {
        width: WIDTH,
        height: HEIGHT,
        paddingLeft: PD.PADDING_6,
        justifyContent: "center",
        backgroundColor: Colors.SKY_BLUE
        // backgroundColor: "pink"
    },
    content: {
        flex: 1,
        paddingRight: PD.PADDING_6,
        paddingVertical: PD.PADDING_3,
        borderBottomWidth: 1,
        borderColor: Colors.WHITE_COLOR,
        justifyContent: "space-between"
    },
    body: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
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
        borderRadius: AVATAR_SIZE / 2
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
        fontSize: responsiveFontSize(2.5),
        lineHeight: responsiveFontSize(3.0),
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
        fontSize: responsiveFontSize(2.2),
        lineHeight: responsiveFontSize(2.7),
        fontFamily: FONT_SF.REGULAR,
        color: "#999999"
        // justifyContent: "flex-start"
        // flex: 1
    },
    leftContent: {
        width: WIDTH_M * 0.2,
        justifyContent: "center",
        lignItems: "flex-start",
        height: HEIGHT
    },

    badget: {
        backgroundColor: Colors.MAIN_COLOR,
        height: 25,
        width: 25,
        borderRadius: 12.5,
        alignItems: "center",
        justifyContent: "center"
    },
    time: {
        fontSize: responsiveFontSize(1.8),
        color: Colors.MAIN_COLOR
    },
    badgetText: {
        color: Colors.WHITE_COLOR
    },
    icon: {
        height: 15,
        width: 15,
        marginRight: 10
    },
    iconNote: {
        height: 22,
        width: 22
    }
};

export default CardAvatar;
