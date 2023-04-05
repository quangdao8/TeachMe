import React from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { AppText, AppImage, Button } from "components";
import { PD, DEVICE, CHAT_TYPE, GROUP_TYPE } from "helper/Consts";
import { Images, FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import { Icon } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import { covertMessage } from "screens/Chats/ChatHistories/Component/Functions";
const moment = require("moment");
import I18n from "helper/locales";
const AVATAR =
    "https://firebasestorage.googleapis.com/v0/b/yo-learner-test.appspot.com/o/yo-learn-avatar%2Fdefault_avatar.png?alt=media&token=fa92022d-e2ae-421d-a23f-04eef8f5a1df";

const HEIGHT =
    DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH < 2 ? DEVICE.DEVICE_HEIGHT * 0.12 : DEVICE.DEVICE_HEIGHT * 0.11;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
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
            .format("DD-MM-YY");
    }
};

const ItemChatForward = (
    props = {
        onPress,
        onLongPress,
        source,
        online,
        groupName,
        lastMessage,
        time,
        unreadMessage,
        chatRoom,
        userId,
        messageType,
        sent
    }
) => {
    let {
        onPress = () => {},
        onLongPress = () => {},
        source = AVATAR,
        online = true,
        groupName = "",
        lastMessage = "",
        time = "",
        unreadMessage = "",
        chatRoom = {},
        userId = -1,
        messageType = 0,
        sent = false
    } = props;
    let timeShow = compareDate(time);
    let message = covertMessage(messageType, chatRoom, lastMessage, userId);
    return (
        <View onLongPress={() => onLongPress()} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.leftContent}>
                    {chatRoom.type == GROUP_TYPE.PRIVATE ? online ? <Online /> : <Offline /> : null}
                    <View style={styles.imageOutLine}>
                        {chatRoom.type == GROUP_TYPE.GROUP && chatRoom.users.length > 2 ? (
                            <View style={{ alignItems: "center" }}>
                                <View
                                    style={[
                                        {
                                            position: "absolute",
                                            zIndex: 5,
                                            borderWidth: 4,
                                            borderColor: "#F1F1F1",
                                            borderRadius: (AVATAR_SIZE * 1.2) / 2,
                                            height: "100%",
                                            width: "100%"
                                        }
                                    ]}
                                />

                                <Grid style={styles.grid}>
                                    <Col>
                                        <View style={styles.imageGridView}>
                                            <AppImage
                                                source={{ uri: chatRoom.users[0].avatar }}
                                                style={styles.imageGrid}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <View style={styles.imageGridView}>
                                                <AppImage
                                                    source={{ uri: chatRoom.users[1].avatar }}
                                                    style={styles.imageGrid}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        </Row>
                                        <Row>
                                            <View style={styles.imageGridView}>
                                                <AppImage
                                                    source={{ uri: chatRoom.users[2].avatar }}
                                                    style={styles.imageGrid}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        </Row>
                                    </Col>
                                </Grid>
                            </View>
                        ) : (
                            <AppImage source={{ uri: source }} style={styles.image} resizeMode="cover" />
                        )}
                    </View>
                </View>
                <View style={styles.centerContent}>
                    <View style={{ height: HEIGHT, justifyContent: "center" }}>
                        <AppText numberOfLines={1} text={groupName} style={[styles.groupName]} />
                        {/* <AppText
                            numberOfLines={2}
                            text={message}
                            style={[
                                styles.groupMessage,
                                unreadMessage > 0 ? { fontFamily: FONT_SF.MEDIUM, color: "#000" } : {}
                            ]}
                        /> */}
                    </View>
                </View>
                <View style={styles.rightContent}>
                    <Button
                        disabled={sent}
                        title={sent ? I18n.t("forwardMessage.sent") : I18n.t("forwardMessage.send")}
                        tStyle={{ fontSize: responsiveFontSize(1.7) }}
                        style={{
                            backgroundColor: sent ? Colors.DIABLED_BUTTON : Colors.MAIN_COLOR,
                            height: "auto",
                            paddingVertical: PD.PADDING_3
                        }}
                        onPress={() => onPress()}
                    />
                </View>
            </View>
        </View>
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
        // padding: 8,
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
    grid: {
        height: AVATAR_SIZE * 1.2,
        width: AVATAR_SIZE * 1.2,
        padding: 3
    },
    imageGridView: {
        flex: 1,
        backgroundColor: "white",
        padding: PD.PADDING_1 / 5
    },
    imageGrid: {
        height: "100%",
        width: "100%"
    },
    groupNameWrap: {
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    groupName: {
        fontSize: responsiveFontSize(2.5),
        lineHeight: responsiveFontSize(3),
        fontFamily: FONT_SF.MEDIUM,
        color: Colors.BLACK_TEXT_COLOR
    },
    groupMessageWrap: {
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    groupMessage: {
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveFontSize(2.5),
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
        width: WIDTH_M * 0.5,
        height: HEIGHT,
        justifyContent: "center"
    },
    rightContent: {
        width: WIDTH_M * 0.3,
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
        flex: 1,
        justifyContent: "center"
    },
    time: {
        fontSize: responsiveFontSize(1.8),
        color: Colors.MAIN_COLOR
    },
    badgetWrap: {
        flex: 1.5,
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
        bottom: AVATAR_SIZE * 0.2,
        right: AVATAR_SIZE * 0.2,
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
    silent: {
        zIndex: 3,
        position: "absolute",
        right: 0,
        height: HEIGHT,
        padding: 8,
        paddingBottom: 8
    }
};

export default ItemChatForward;
