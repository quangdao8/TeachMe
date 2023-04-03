import React, { Component } from "react";
import {
    Modal,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Clipboard,
    Alert,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    TouchableHighlight,
    Text
} from "react-native";
import { Colors } from "helper";
import { PD, DEVICE, CHAT_TYPE } from "helper/Consts";
import { Icon } from "native-base";
import { AppText, AppImage, Input, Button } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import _ from "lodash";
import I18n from "helper/locales";
import firebase from "@react-native-firebase/database";
import chatFn from "../Functions";
import { FONT_SF } from "assets";
import { Col, Row, Grid } from "react-native-easy-grid";
import { isIphoneX } from "react-native-iphone-x-helper";

const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
class OptionFunction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: false,
            editText: "",
            key: "",
            objValue: {},
            scrollViewWidth: 0,
            currentXOffset: 0
        };
    }
    _pressFunction(func) {
        const { closeOption = () => {} } = this.props;
        setTimeout(() => {
            switch (func) {
                case "copy":
                    this._funcCopy();
                    closeOption();
                    break;
                case "remove":
                    this._questRemove();
                    break;
                case "edit":
                    this._openEditBox();
                    break;
                case "forward":
                    this._funcForward();
                    // closeOption();
                    break;
                case "reply":
                    this._funcReply();
                    break;
                default:
                    closeOption();
                    break;
            }
        }, 100);
    }

    async _funcCopy() {
        const { message, mine } = this.props;
        const messType = message.type;
        switch (messType) {
            case CHAT_TYPE.TEXT:
            case CHAT_TYPE.REPLY:
            case CHAT_TYPE.EDITED_MESSAGE:
                await Clipboard.setString(message.text);
                break;
            case CHAT_TYPE.IMAGE:
                await Clipboard.setString(message.image.uri);
                break;
            // case CHAT_TYPE.IMAGES:
            //     await Clipboard.setString(message.images);
            // break;
            case CHAT_TYPE.FILE:
                await Clipboard.setString(message.file.uri);
                break;
            default:
                break;
        }
    }

    _questRemove() {
        const { message } = this.props;
        const disabledCopy = message.type == CHAT_TYPE.DELETE_MESSAGE;
        Alert.alert(
            I18n.t("Alert.notice"),
            I18n.t("optionFunc.confirmDelete"),
            [
                {
                    text: I18n.t("optionFunc.cancel"),
                    onPress: () => {},
                    style: "cancel"
                },
                {
                    text: I18n.t("optionFunc.removeMyBubbleMes"),
                    onPress: () => this._funcRemoveMyBubbleMes(),
                    style: { color: "red" }
                },
                {
                    text: I18n.t("optionFunc.removeOpBubbleMes"),
                    onPress: () => this._funcRemoveOpBubbleMes(),
                    style: { color: "red" }
                }
            ],
            { cancelable: false }
        );
    }

    _funcRemoveMyBubbleMes() {
        const { roomId, message, ondeleted = () => {}, closeOption = () => {} } = this.props;

        const { createdAt } = message;
        firebase
            .database()
            .ref(`/chat-group/${roomId}`)
            .orderByChild("createdAt")
            .endAt(createdAt)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                const key = Object.keys(message);
                const value = Object.values(message);
                let mes = chatFn.deCryptMessage(value[0]);
                const objDelete = chatFn.convertDeleteMyMessage(mes);
                let param = chatFn.enCryptMessage(objDelete);

                firebase
                    .database()
                    .ref(`/chat-group/${roomId}/${key[0]}`)
                    .update(param)
                    .then(value => {
                        ondeleted();
                        closeOption();
                    })
                    .catch(err => {
                        console.error(err);
                        closeOption();
                    });
            })
            .catch(error => {
                console.error(error);
            });
    }

    _funcRemoveOpBubbleMes() {
        const { roomId, message, ondeleted = () => {}, closeOption = () => {} } = this.props;

        const { createdAt } = message;
        firebase
            .database()
            .ref(`/chat-group/${roomId}`)
            .orderByChild("createdAt")
            .endAt(createdAt)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                const key = Object.keys(message);
                const value = Object.values(message);
                let mes = chatFn.deCryptMessage(value[0]);
                const objDelete = chatFn.convertDeleteMessage(mes);
                let param = chatFn.enCryptMessage(objDelete);

                firebase
                    .database()
                    .ref(`/chat-group/${roomId}/${key[0]}`)
                    .update(param)
                    .then(value => {
                        ondeleted();
                        closeOption();
                    })
                    .catch(err => {
                        console.error(err);
                        closeOption();
                    });
            })
            .catch(error => {
                console.error(error);
            });
    }

    _openEditBox() {
        const { roomId, message, ondeleted = () => {} } = this.props;
        const { createdAt } = message;
        firebase
            .database()
            .ref(`/chat-group/${roomId}`)
            .orderByChild("createdAt")
            .endAt(createdAt)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                const key = Object.keys(message);
                const value = Object.values(message)[0];
                const objValue = chatFn.deCryptMessage(value);

                this.setState({ editText: objValue ? objValue.text : "", showEdit: true, key, objValue });
            });
        // firebase
        //     .database()
        //     .ref(`/chat-group/${roomId}/${key[0]}`)
        //     .update(objDelete)
        //     .then(value => {})
        //     .catch(err => {
        //         console.log(err);
        //     });
    }
    _funcForward() {
        const { message, onForward = () => {} } = this.props;
        onForward(message);
    }

    _funcReply() {
        const { message, onReply = () => {} } = this.props;
        onReply(message);
    }

    // TODO: render

    titleRenderText() {
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

    titleRenderImage() {
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

    titleRenderImages() {
        const { message } = this.props;
        const { images } = message;
        if (_.isEmpty(images)) {
            return;
        }
        let imagess = Object.values(images);
        let listImages = [];
        let array = [];
        imagess.map(async (el, index) => {
            array.push(el);
            if (index % 3 == 2 || index == imagess.length - 1) {
                listImages.push(array);
                array = [];
            }
        });

        return (
            <View
                style={[
                    styles.contentTitle,
                    { flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }
                ]}
            >
                <View
                    style={{
                        borderRadius: PD.PADDING_2,
                        paddingHorizontal: PD.PADDING_1 / 2,
                        backgroundColor: "white"
                    }}
                >
                    <View style={{ height: PD.PADDING_1 / 2 }} />
                    <Grid style={[styles.image, { height: (TITLE_HEIGHT * 0.6) / (4 - listImages.length) }]}>
                        {listImages.map((el, index) => {
                            return (
                                <Row key={index}>
                                    {el.map((elc, index) => {
                                        return (
                                            <Col key={index}>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: "white",
                                                        padding: PD.PADDING_1 / 10
                                                    }}
                                                >
                                                    <AppImage
                                                        source={{ uri: elc.uri }}
                                                        style={{
                                                            height: "100%",
                                                            width: "100%",
                                                            borderRadius: PD.PADDING_1 / 2
                                                        }}
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            );
                        })}
                    </Grid>
                    <View style={{ height: PD.PADDING_1 / 2 }} />
                </View>
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

    titleRenderFile() {
        const { message } = this.props;
        return (
            <View style={[styles.contentTitle, { flexDirection: "row", justifyContent: "flex-start" }]}>
                <View style={{ flexDirection: "column", paddingLeft: PD.PADDING_2 }}>
                    <AppText text={_.isEmpty(message) ? "" : message.user.name} style={styles.txtContent} />
                    <AppText
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        text={`[${I18n.t("optionFunc.file")}]`}
                        style={styles.txtContent}
                    />
                </View>
            </View>
        );
    }

    titleRenderContact() {
        const { message } = this.props;
        return (
            <View style={[styles.contentTitle, { flexDirection: "row", justifyContent: "flex-start" }]}>
                <View style={{ flexDirection: "column", paddingLeft: PD.PADDING_2 }}>
                    <AppText text={_.isEmpty(message) ? "" : message.user.name} style={styles.txtContent} />
                    <AppText
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        text={`[${I18n.t("optionFunc.contact")}]`}
                        style={styles.txtContent}
                    />
                </View>
            </View>
        );
    }

    titleRenderLocation() {
        const { message } = this.props;
        return (
            <View style={styles.contentTitle}>
                <AppText text={_.isEmpty(message) ? "" : message.user.name} style={styles.txtContent} />
                <AppText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    text={`[${I18n.t("optionFunc.location")}]`}
                    style={styles.txtContent}
                />
            </View>
        );
    }

    titleRenderContent() {
        const { message } = this.props;
        const { type } = message;
        switch (type) {
            case CHAT_TYPE.TEXT:
            case CHAT_TYPE.REPLY:
            case CHAT_TYPE.EDITED_MESSAGE:
                return this.titleRenderText();
            case CHAT_TYPE.IMAGE:
                return this.titleRenderImage();
            case CHAT_TYPE.IMAGES:
                return this.titleRenderImages();
            case CHAT_TYPE.FILE:
                return this.titleRenderFile();
            case CHAT_TYPE.CONTACT:
                return this.titleRenderContact();
            case CHAT_TYPE.LOCATION:
                return this.titleRenderLocation();
            default:
                break;
        }
    }

    renderCopy(disabledCopy) {
        return (
            <TouchableOpacity disabled={disabledCopy} onPress={() => this._pressFunction("copy")} style={styles.btn}>
                <Icon name="md-copy" style={{ color: disabledCopy ? Colors.DIABLED_BUTTON : Colors.MAIN_COLOR }} />
                <AppText text={I18n.t("optionFunc.copy")} style={styles.txtContent} />
            </TouchableOpacity>
        );
    }

    renderDelete() {
        const { mine } = this.props;
        return (
            <TouchableOpacity disabled={!mine} onPress={() => this._pressFunction("remove")} style={styles.btn}>
                <Icon name="md-trash" style={{ color: mine ? "firebrick" : Colors.DIABLED_BUTTON }} />
                <AppText text={I18n.t("optionFunc.remove")} style={styles.txtContent} />
            </TouchableOpacity>
        );
    }

    renderEdit() {
        const { mine } = this.props;
        return (
            <TouchableOpacity disabled={!mine} onPress={() => this._pressFunction("edit")} style={styles.btn}>
                <Icon name="ios-create" style={{ color: mine ? Colors.MAIN_COLOR : Colors.DIABLED_BUTTON }} />
                <AppText text={I18n.t("optionFunc.edit")} style={styles.txtContent} />
            </TouchableOpacity>
        );
    }

    renderForward() {
        return (
            <TouchableOpacity onPress={() => this._pressFunction("forward")} style={styles.btn}>
                <Icon name="ios-redo" style={{ color: Colors.MAIN_COLOR }} />
                <AppText text={I18n.t("optionFunc.forward")} style={styles.txtContent} />
            </TouchableOpacity>
        );
    }

    renderReply() {
        return (
            <TouchableOpacity onPress={() => this._pressFunction("reply")} style={styles.btn}>
                <Icon name="ios-undo" style={{ color: Colors.MAIN_COLOR }} />
                <AppText text={I18n.t("optionFunc.reply")} style={styles.txtContent} />
            </TouchableOpacity>
        );
    }

    renderFunctionByType() {
        const { message } = this.props;
        const { type } = message;
        switch (type) {
            case CHAT_TYPE.TEXT:
            case CHAT_TYPE.REPLY:
            case CHAT_TYPE.EDITED_MESSAGE:
                return this.fnRenderText();
            case CHAT_TYPE.CONTACT:
                return this.fnRenderContact();
            case CHAT_TYPE.IMAGE:
                return this.fnRenderImage();
            case CHAT_TYPE.IMAGES:
                return this.fnRenderImage();
            case CHAT_TYPE.FILE:
                return this.fnRenderFile();
            case CHAT_TYPE.LOCATION:
                return this.fnRenderLocation();
            default:
                return null;
        }
    }

    _handleScroll = event => {
        newXOffset = event.nativeEvent.contentOffset.x;
        this.setState({ currentXOffset: newXOffset });
    };

    leftArrow = () => {
        eachItemOffset = this.state.scrollViewWidth / 4; // Divide by 10 because I have 10 <View> items
        _currentXOffset = this.state.currentXOffset - eachItemOffset;
        this.refs.scrollView.scrollTo({ x: _currentXOffset, y: 0, animated: true });
    };

    rightArrow = () => {
        eachItemOffset = this.state.scrollViewWidth / 4; // Divide by 10 because I have 10 <View> items
        _currentXOffset = this.state.currentXOffset + eachItemOffset;
        this.refs.scrollView.scrollTo({ x: _currentXOffset, y: 0, animated: true });
    };

    fnRenderText() {
        return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity hitSlop={hitSlop} style={styles.arrowBtn} onPress={this.leftArrow}>
                    <Icon name="ios-arrow-back" style={{ color: Colors.MAIN_COLOR }} />
                </TouchableOpacity>
                <ScrollView
                    onContentSizeChange={(w, h) => this.setState({ scrollViewWidth: w })}
                    ref="scrollView"
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    style={styles.functionWrap}
                    scrollEventThrottle={16}
                    onScroll={this._handleScroll}
                >
                    {this.renderCopy()}
                    {this.renderForward()}
                    {this.renderReply()}
                    {this.renderDelete()}
                    {this.renderEdit()}
                </ScrollView>
                <TouchableOpacity hitSlop={hitSlop} style={styles.arrowBtn} onPress={this.rightArrow}>
                    <Icon name="ios-arrow-forward" style={{ color: Colors.MAIN_COLOR }} />
                </TouchableOpacity>
            </View>
        );
    }

    fnRenderContact() {
        return (
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.functionWrap}>
                {this.renderForward()}
                {this.renderReply()}
                {this.renderDelete()}
            </ScrollView>
        );
    }

    fnRenderImage() {
        return (
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.functionWrap}>
                {this.renderForward()}
                {this.renderReply()}
                {this.renderDelete()}
            </ScrollView>
        );
    }

    fnRenderFile() {
        return (
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.functionWrap}>
                {this.renderForward()}
                {this.renderReply()}
                {this.renderDelete()}
            </ScrollView>
        );
    }

    fnRenderLocation() {
        return (
            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.functionWrap}>
                {this.renderForward()}
                {this.renderReply()}
                {this.renderDelete()}
            </ScrollView>
        );
    }

    _cancelBtn() {
        const { closeOption = () => {} } = this.props;
        this.setState({ showEdit: false }, () => {
            closeOption();
        });
    }

    _onEditMessage() {
        let { editText, key, objValue } = this.state;
        const { roomId, closeOption = () => {} } = this.props;
        let editedMessage =
            objValue.type == CHAT_TYPE.REPLY
                ? chatFn.convertEditedMessageReply(objValue, editText)
                : chatFn.convertEditedMessage(objValue, editText);
        let param = chatFn.enCryptMessage(editedMessage);
        firebase
            .database()
            .ref(`/chat-group/${roomId}/${key[0]}`)
            .update(param)
            .then(value => {
                this._cancelBtn();
            })
            .catch(err => {
                this._cancelBtn();
            });
    }

    render() {
        const { visible, closeOption = () => {} } = this.props;
        const { showEdit, editText } = this.state;
        return (
            <Modal visible={visible} animationType="slide" transparent>
                <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={() => {
                        if (showEdit) {
                            Keyboard.dismiss();
                        } else {
                            closeOption();
                        }
                    }}
                >
                    {showEdit ? (
                        <KeyboardAvoidingView
                            behavior="padding"
                            enabled
                            style={[styles.container, { justifyContent: "flex-start", alignItems: "center" }]}
                        >
                            <View style={styles.changeMessWrap}>
                                <AppText text={I18n.t("optionFunc.editMessage")} style={styles.titleChangeMess} />
                                <TextInput
                                    multiline
                                    style={styles.txtInputStyles}
                                    clearButton
                                    placeholder={I18n.t("optionFunc.editMessage")}
                                    onChangeText={e => this.setState({ editText: e })}
                                    value={editText}
                                />
                                <View style={styles.btnWrap}>
                                    <Button
                                        tStyle={{ fontSize: responsiveFontSize(2) }}
                                        style={{ width: DEVICE.DEVICE_WIDTH * 0.4 }}
                                        title={I18n.t("optionFunc.change")}
                                        onPress={() => this._onEditMessage()}
                                    />
                                    <Button
                                        tStyle={{ fontSize: responsiveFontSize(2) }}
                                        style={{ width: DEVICE.DEVICE_WIDTH * 0.4 }}
                                        title={I18n.t("optionFunc.cancel")}
                                        onPress={() => this._cancelBtn()}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    ) : (
                        <View style={styles.container}>
                            <View style={styles.content}>
                                <View style={styles.titleWrap}>
                                    <View style={styles.straightLine}></View>
                                    {this.titleRenderContent()}
                                    <View style={styles.closeWrap}>
                                        <Icon name="ios-close" style={{ fontSize: responsiveFontSize(5) }} />
                                    </View>
                                </View>
                                {this.renderFunctionByType()}
                            </View>
                        </View>
                    )}
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
        justifyContent: "flex-end",
        paddingBottom: isIphoneX() ? 30 : 0
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
        width: 3,
        borderRadius: 3,
        backgroundColor: Colors.MAIN_COLOR
    },
    functionWrap: {
        // alignItems: "center",
        // flexDirection: "row"
        // paddingHorizontal: PD.PADDING_2,
        // paddingVertical: PD.PADDING_2
        // flex: 1,
        // height: 60
        // justifyContent: "space-evenly"
    },
    contentTitle: {
        justifyContent: "space-evenly",
        paddingLeft: PD.PADDING_4,
        // backgroundColor: "green",
        height: TITLE_HEIGHT * 0.7,
        width: "90%"
    },
    txtContent: {
        fontSize: responsiveFontSize(1.9),
        lineHeight: responsiveFontSize(2.4)
    },
    closeWrap: {
        width: "10%",
        // backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    image: {
        height: TITLE_HEIGHT * 0.6,
        width: TITLE_HEIGHT * 0.6
    },
    btn: {
        justifyContent: "center",
        alignItems: "center",
        width: DEVICE.DEVICE_WIDTH * 0.21,
        paddingVertical: PD.PADDING_1
    },
    fnWrap: {
        flexDirection: "row",
        justifyContent: "space-evenly"
        // flex: 1
    },
    changeMessWrap: {
        marginTop: DEVICE.DEVICE_HEIGHT * 0.21,
        backgroundColor: Colors.WHITE_COLOR,
        width: "100%",
        paddingHorizontal: PD.PADDING_4,
        borderRadius: PD.PADDING_4
    },
    titleChangeMess: {
        textAlign: "center",
        fontSize: responsiveFontSize(2.5),
        paddingVertical: PD.PADDING_2,
        fontFamily: FONT_SF.SEMIBOLD
    },
    txtInputStyles: {
        padding: PD.PADDING_3,
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR,
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: PD.PADDING_4,
        fontSize: responsiveFontSize(2),
        height: 60,
        borderColor: Colors.BORDER_BOTTOM_INPUT
    },
    btnWrap: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: PD.PADDING_4
    },
    arrowBtn: {
        paddingVertical: PD.PADDING_2,
        paddingHorizontal: PD.PADDING_1
    }
};

export default OptionFunction;
