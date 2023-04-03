import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Platform } from "react-native";
import { ICON, FONT_SF } from "../assets";
import { Colors } from "../helper";
import { PD, FONT_SIZE } from "../helper/Consts";
import { AppText, AppImage } from "../components";
import { TouchableOpacity as AndTouchableOpacity } from "react-native-gesture-handler";
import I18n from "../helper/locales";
const _ = require("lodash");
const hipSlop = {
    top: 8,
    bottom: 8,
    left: 8,
    right: 8
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
class CardTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(props) {}

    iconWithText(props) {
        let { text = "", icon = ICON.SUBJECT } = props;
        return (
            <View style={styles.wrap}>
                <AppImage local source={icon} resizeMode="contain" style={styles.icon} />

                <View style={styles.textWrap}>
                    <AppText numberOfLines={1} text={text} style={styles.text} />
                </View>
            </View>
        );
    }

    renderTeacher() {
        let { data, selected, onPress = () => {}, pressHand = () => {}, online } = this.props;
        let { city, user, school, specialize, job_position, avatar, latitude, longitude } = data;

        let schoolName = I18n.t("teacherScreen.noInfo");
        if (!_.isEmpty(school)) {
            schoolName = school.name;
        }

        const dataSubject = _.isEmpty(specialize) ? [] : specialize;
        let a = "";
        a += dataSubject.map((item, index) => ` ${item.specialize_topic_name}`);
        return (
            <View style={selected ? styles.containerSelect : styles.container}>
                <View style={{ flex: 1.5, justifyContent: "flex-start" }}>
                    <AppImage resizeMode="cover" source={{ uri: avatar }} style={styles.image} />
                    {online ? <Online /> : <Offline />}
                </View>
                <View style={{ flex: 5 }}>
                    <AppText
                        text={`${I18n.t("teacherScreen.teacher")}${user.first_name} ${user.last_name}`}
                        style={styles.name}
                    />
                    <View style={styles.wrap}>
                        <AppImage local source={ICON.SUBJECT} resizeMode="contain" style={styles.icon} />

                        <View style={styles.textWrap}>
                            <AppText numberOfLines={1} text={a} style={styles.text} />
                        </View>
                    </View>
                    {this.iconWithText({
                        icon: ICON.JOB,
                        text: job_position ? job_position.name : I18n.t("teacherScreen.noInfo")
                    })}
                    {this.iconWithText({ icon: ICON.SCHOOL, text: schoolName })}
                    {this.iconWithText({ icon: ICON.LOCATION, text: city ? city : I18n.t("teacherScreen.noInfo") })}
                </View>
            </View>
        );
    }

    render() {
        let { data, selected, onPress = () => {}, pressHand = () => {} } = this.props;
        let { city, user, school, specialize, job_position, avatar, latitude, longitude } = data;
        if (latitude == 0 && longitude == 0) {
            return null;
        } else {
            if (Platform.OS == "ios") {
                return (
                    <View>
                        <TouchableOpacity {...this.props} onPress={() => onPress(data)}>
                            {this.renderTeacher()}
                            <View
                                style={{
                                    marginLeft: PD.PADDING_4,
                                    height: 1,
                                    backgroundColor: Colors.SKY_BLUE
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            hitSlop={hipSlop}
                            onPress={() => pressHand(data)}
                            style={{
                                justifyContent: "center",
                                height: "100%",
                                position: "absolute",
                                right: PD.PADDING_4,
                                zIndex: 999
                            }}
                        >
                            <AppImage
                                local
                                source={selected ? ICON.HAND_RED : ICON.HAND_BLUE}
                                style={styles.iconHand}
                            />
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return (
                    <View>
                        <TouchableOpacity {...this.props} onPress={() => onPress(data)}>
                            {this.renderTeacher()}
                            <View
                                style={{
                                    marginLeft: PD.PADDING_4,
                                    height: 1,
                                    backgroundColor: Colors.SKY_BLUE
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            hitSlop={hipSlop}
                            onPress={() => pressHand(data)}
                            style={{
                                justifyContent: "center",
                                height: "100%",
                                position: "absolute",
                                right: PD.PADDING_4,
                                zIndex: 999
                            }}
                        >
                            <AppImage
                                local
                                source={selected ? ICON.HAND_RED : ICON.HAND_BLUE}
                                style={styles.iconHand}
                            />
                        </TouchableOpacity>
                    </View>
                );
            }
        }
    }
}

const styles = {
    container: {
        paddingHorizontal: PD.PADDING_4,
        paddingVertical: PD.PADDING_4,
        flexDirection: "row",
        flex: 1
    },
    containerSelect: {
        paddingHorizontal: PD.PADDING_4,
        paddingVertical: PD.PADDING_4,
        flexDirection: "row",
        flex: 1,
        backgroundColor: Colors.SKY_BLUE
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 30
    },
    name: {
        fontSize: FONT_SIZE.TITLE,
        fontFamily: FONT_SF.MEDIUM,
        marginLeft: PD.PADDING_1
    },
    iconHand: {
        height: 30,
        width: 30
    },
    // icon with text
    wrap: {
        flexDirection: "row",
        paddingHorizontal: PD.PADDING_1,
        paddingVertical: PD.PADDING_1 / 2
    },
    iconWrap: {
        // flex: 1
    },
    icon: {
        height: 20,
        width: 20,
        marginRight: 5
    },
    textWrap: {
        flex: 8,
        justifyContent: "center"
    },
    text: {
        color: Colors.GRAY_TEXT_COLOR,
        fontSize: FONT_SIZE.CONTENT_SIZE
    },
    onlineDotOutline: {
        padding: 4,
        position: "absolute",
        height: 16,
        width: 16,
        borderRadius: 9,
        top: 60 * 0.6,
        right: 60 * 0.2,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    }
};

export default CardTeacher;
