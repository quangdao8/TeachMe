import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText, AppImage } from "components";
import { PD, DEVICE } from "helper/Consts";
import { Images, FONT_SF, ICON } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import I18n from "helper/locales";
const _ = require("lodash");

const HEIGHT =
    DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH < 2 ? DEVICE.DEVICE_HEIGHT * 0.22 : DEVICE.DEVICE_HEIGHT * 0.2;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 8;

const CardTeacher = (
    props = { onPress, source, online, groupName, lastMessage, time, unreadMessage, item, navigation }
) => {
    let { onPress = () => {}, source, item = {}, navigation, online = true } = props;
    const realName = item.id ? item.teacher.user.first_name + " " + item.teacher.user.last_name : "";
    // const name = realName == item.nickname ? item.nickname : realName ? item.nickname : realName;
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("DetailTeacher", { contact: item })}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.leftContent}>
                    {online ? <Online /> : <Offline />}
                    <View style={styles.imageOutLine}>
                        <AppImage
                            source={item.teacher.avatar ? { uri: item.teacher.avatar } : Images.DEFAULT_AVATAR}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View style={styles.centerContent}>
                    <View style={{ justifyContent: "space-evenly", height: HEIGHT, paddingVertical: PD.PADDING_2 }}>
                        <AppText numberOfLines={1} text={`${realName}`} style={styles.groupName} />
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AppImage local source={ICON.SUBJECT} style={styles.icInfo} />
                            <AppText
                                numberOfLines={1}
                                text={
                                    _.isEmpty(item.teacher.specialize)
                                        ? I18n.t("teacherScreen.noInfo")
                                        : item.teacher.specialize[0].specialize_topic_name
                                }
                                style={{ color: Colors.GRAY_TEXT_COLOR }}
                            />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AppImage local source={ICON.JOB} style={styles.icInfo} />
                            <AppText
                                numberOfLines={1}
                                text={
                                    _.isEmpty(item.teacher.job_position)
                                        ? I18n.t("teacherScreen.noInfo")
                                        : item.teacher.job_position.name
                                }
                                style={{ color: Colors.GRAY_TEXT_COLOR }}
                            />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AppImage local source={ICON.SCHOOL} style={styles.icInfo} />
                            <AppText
                                numberOfLines={1}
                                text={
                                    _.isEmpty(item.teacher.school)
                                        ? I18n.t("teacherScreen.noInfo")
                                        : item.teacher.school.name
                                }
                                style={{ color: Colors.GRAY_TEXT_COLOR }}
                            />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AppImage local source={ICON.LOCATION} style={styles.icInfo} />
                            <AppText
                                numberOfLines={1}
                                text={_.isEmpty(item.teacher.city) ? I18n.t("teacherScreen.noInfo") : item.teacher.city}
                                style={{ color: Colors.GRAY_TEXT_COLOR }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
const Online = (props = {}) => {
    return (
        <View style={styles.onlineDotOutline}>
            <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "#90bd3f" }} />
        </View>
    );
};

const Offline = (props = {}) => {
    return (
        // <View style={styles.offlineDotOutline}>
        <View style={styles.onlineDotOutline}>
            <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: "#9d9d9d" }} />
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
        borderBottomWidth: 1,
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
        borderRadius: AVATAR_SIZE / 2
    },

    groupName: {
        fontSize: responsiveFontSize(2.3),
        lineHeight: responsiveFontSize(3),
        fontFamily: FONT_SF.MEDIUM,
        color: Colors.BLACK_TEXT_COLOR
    },

    leftContent: {
        width: WIDTH_M * 0.2,
        height: HEIGHT,
        marginRight: 10,
        paddingTop: HEIGHT * 0.1
    },
    centerContent: {
        width: WIDTH_M * 0.6,
        height: HEIGHT,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },

    icInfo: {
        width: 20,
        height: 20,
        marginRight: 5
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
    onlineDotOutline: {
        padding: 4,
        position: "absolute",
        height: 16,
        width: 16,
        borderRadius: 9,
        top: AVATAR_SIZE,
        right: AVATAR_SIZE * 0.2,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    }
};

export default CardTeacher;
