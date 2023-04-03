import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText, AppImage } from "components";
import { PD, DEVICE, FONT_SIZE } from "helper/Consts";
import { Images, FONT_SF, ICON } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "../../../helper";
import I18n from "helper/locales";
const _ = require("lodash");

const HEIGHT =
    DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH < 2 ? DEVICE.DEVICE_HEIGHT * 0.22 : DEVICE.DEVICE_HEIGHT * 0.2;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.17;
const AVATAR_SIZE = OUTLINE_SIZE - 8;

const CardTeacher = (
    props = {
        onPressRight,
        source,
        online,
        groupName,
        lastMessage,
        time,
        unreadMessage,
        item,
        navigation,
        isSub
    }
) => {
    let { onPressRight = () => {}, source, item = {}, navigation, online = true, isSub = false } = props;
    const realName = item.id ? item.teacher.user.first_name + " " + item.teacher.user.last_name : "";
    const name = realName == item.nickname ? item.nickname : realName ? item.nickname : realName;

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("DetailTeacher", { contact: item })}
            style={styles.container}
            disabled={!isSub}
        >
            <View style={styles.content}>
                <View style={[styles.leftContent, { opacity: isSub ? 1 : 0.5 }]}>
                    {online ? <Online /> : <Offline />}
                    <View style={styles.imageOutLine}>
                        <AppImage
                            source={item.avatar ? { uri: item.avatar } : item.teacher.avatar}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View style={styles.centerContent}>
                    <View
                        style={{ flex: 0.85, justifyContent: "space-evenly", height: HEIGHT, opacity: isSub ? 1 : 0.5 }}
                    >
                        <AppText numberOfLines={1} text={`${name}`} style={styles.groupName} />
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AppImage local source={ICON.SUBJECT} style={styles.icInfo} />
                            <AppText
                                numberOfLines={1}
                                text={
                                    _.isEmpty(item.teacher.specialize)
                                        ? I18n.t("teacherScreen.noInfo")
                                        : item.teacher.specialize[0].specialize_topic_name
                                }
                                style={styles.textContent}
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
                                style={styles.textContent}
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
                                style={styles.textContent}
                            />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AppImage local source={ICON.LOCATION} style={styles.icInfo} />
                            <AppText
                                numberOfLines={1}
                                text={_.isEmpty(item.teacher.city) ? I18n.t("teacherScreen.noInfo") : item.teacher.city}
                                style={styles.textContent}
                            />
                        </View>
                    </View>
                    <View style={styles.viewBtnRight}>
                        <TouchableOpacity style={styles.btnRight} onPress={onPressRight}>
                            <AppText
                                text={
                                    !isSub
                                        ? I18n.t("register.askLesson").toUpperCase()
                                        : I18n.t("register.askLesson").toUpperCase()
                                }
                                style={styles.txtBtnRight}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
const Online = (props = {}) => {
    return (
        <View style={styles.onlineDotOutline}>
            <View
                style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: "#90bd3f"
                }}
            />
        </View>
    );
};

const Offline = (props = {}) => {
    return (
        // <View style={styles.offlineDotOutline}>
        <View style={styles.onlineDotOutline}>
            <View
                style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: "#9d9d9d"
                }}
            />
        </View>
    );
};
const styles = {
    container: {
        flex: 1,
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        backgroundColor: Colors.CONTENT_COLOR
    },
    content: {
        flex: 1,
        marginLeft: PD.PADDING_4,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: Colors.WHITE_COLOR
    },
    imageOutLine: {
        height: OUTLINE_SIZE,
        width: OUTLINE_SIZE,
        borderRadius: OUTLINE_SIZE / 2,
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
        height: HEIGHT,
        marginRight: 16,
        paddingTop: HEIGHT * 0.1
    },
    centerContent: {
        flex: 1,
        height: HEIGHT,
        justifyContent: "space-between",
        flexDirection: "row"
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
        right: AVATAR_SIZE * 0,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },
    viewBtnRight: {
        paddingBottom: PD.PADDING_4,
        paddingRight: HEIGHT * 0.1,
        justifyContent: "flex-end",
        position: "absolute",
        right: 0,
        bottom: 0
    },
    btnRight: {
        padding: PD.PADDING_2,
        paddingHorizontal: PD.PADDING_3,
        backgroundColor: Colors.MAIN_COLOR,
        minWidth: WIDTH * 0.25,
        alignItems: "center",
        borderRadius: 10
    },
    txtBtnRight: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(1.6)
    }
};

export default CardTeacher;
