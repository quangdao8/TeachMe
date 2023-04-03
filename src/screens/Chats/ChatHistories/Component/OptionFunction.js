import React, { Component } from "react";
import { Modal, View, TouchableWithoutFeedback, TouchableOpacity, Clipboard, Alert } from "react-native";
import { Colors } from "helper";
import { PD, DEVICE, CHAT_TYPE } from "helper/Consts";
import { Icon } from "native-base";
import { AppText, AppImage } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import _ from "lodash";
import I18n from "helper/locales";

class OptionFunction extends Component {
    _funcNotification() {
        const { onPressNoti = () => {} } = this.props;
        onPressNoti();
    }

    _funcLeaveGroup() {
        const { onPressLeave = () => {} } = this.props;
        Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.askLeaveGroup"), [
            {
                text: I18n.t("Alert.cancel"),
                style: "cancel"
            },
            { text: "OK", onPress: () => onPressLeave() }
        ]);
    }

    _pressFunction(func) {
        const { closeOption = () => {} } = this.props;
        closeOption();
        setTimeout(() => {
            switch (func) {
                case "notification":
                    this._funcNotification();
                    break;
                case "leave":
                    this._funcLeaveGroup();
                    break;
                default:
                    closeOption();
                    break;
            }
        }, 100);
    }

    titleText() {
        const { message } = this.props;
        return (
            <View style={styles.contentTitle}>
                <AppText text={_.isEmpty(message) ? "" : message.user.name} style={styles.txtContent} />
                <AppText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    text={`"${_.isEmpty(message) ? "" : message.text}"`}
                    style={[styles.txtContent]}
                />
            </View>
        );
    }

    titleImage() {
        const { message } = this.props;
        return (
            <View
                style={[
                    styles.contentTitle,
                    { flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }
                ]}
            >
                <AppImage source={{ uri: message.image.uri }} style={styles.image} resizeMode="cover" />
                <View style={{ flexDirection: "column", paddingLeft: PD.PADDING_2 }}>
                    <AppText text={_.isEmpty(message) ? "" : message.user.name} style={styles.txtContent} />
                    <AppText
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        text={`[${I18n.t("optionFunc.image")}]`}
                        style={styles.txtContent}
                    />
                </View>
            </View>
        );
    }

    // renderTitleContent() {
    //     const { message } = this.props;
    //     const { type } = message;
    //     switch (type) {
    //         case CHAT_TYPE.TEXT:
    //             return this.titleText();
    //         case CHAT_TYPE.IMAGE:
    //             return this.titleImage();
    //         case CHAT_TYPE.FILE:
    //             return this.renderFile();
    //         case CHAT_TYPE.CONTACT:
    //             return this.renderContact();
    //         case CHAT_TYPE.LOCATION:
    //             return this.renderLocation();
    //         default:
    //             break;
    //     }
    // }

    renderFunction() {
        const { notification } = this.props;
        return (
            <View style={styles.functionWrap}>
                <TouchableOpacity
                    onPress={() => this._pressFunction("notification")}
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Icon
                        name={notification ? "ios-notifications-off" : "ios-notifications"}
                        style={{ color: notification ? Colors.RED_COLOR : Colors.MAIN_COLOR }}
                    />
                    <AppText
                        text={notification ? I18n.t("optionFunc.notificationOff") : I18n.t("optionFunc.notificationOn")}
                        style={styles.txtContent}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this._pressFunction("leave")}
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Icon name={"ios-trash"} style={{ color: Colors.MAIN_COLOR }} />
                    <AppText text={I18n.t("button.delete")} style={styles.txtContent} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { visible, closeOption = () => {} } = this.props;
        return (
            <Modal visible={visible} animationType="slide" transparent>
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => closeOption()}>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <View style={styles.titleWrap}>
                                <View style={styles.closeWrap}></View>
                                <View style={styles.straightLine}>
                                    <AppText
                                        text={I18n.t("optionFunc.option")}
                                        style={{ fontSize: responsiveFontSize(2.5) }}
                                    />
                                </View>
                                <View style={styles.closeWrap}>
                                    <Icon name="ios-close" style={{ fontSize: responsiveFontSize(5) }} />
                                </View>
                            </View>
                            {this.renderFunction()}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
        // return null;
    }
}

const TITLE_HEIGHT = 50;

const styles = {
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "flex-end"
    },
    content: {
        backgroundColor: Colors.WHITE_COLOR,
        borderTopLeftRadius: PD.PADDING_4,
        borderTopRightRadius: PD.PADDING_4
    },
    titleWrap: {
        alignItems: "center",
        flexDirection: "row",
        height: TITLE_HEIGHT,
        paddingHorizontal: PD.PADDING_2,
        borderBottomWidth: 1,
        width: DEVICE.DEVICE_WIDTH,
        borderColor: Colors.MAIN_COLOR
    },
    straightLine: {
        height: TITLE_HEIGHT * 0.6,
        flex: 5,
        borderRadius: 3,
        // backgroundColor: Colors.MAIN_COLOR,
        justifyContent: "center",
        alignItems: "center"
    },
    functionWrap: {
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: PD.PADDING_2,
        paddingVertical: PD.PADDING_2,
        justifyContent: "space-evenly"
    },
    contentTitle: {
        justifyContent: "space-evenly",
        paddingLeft: PD.PADDING_4,
        // backgroundColor: "green",
        height: TITLE_HEIGHT * 0.7,
        width: "90%"
    },
    txtContent: {
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveFontSize(2.5)
    },
    closeWrap: {
        flex: 1,
        // backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    image: {
        height: TITLE_HEIGHT * 0.6,
        width: TITLE_HEIGHT * 0.6
    }
};

export default OptionFunction;
