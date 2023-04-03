import React, { Component } from "react";
import { View, ScrollView, Platform, Modal, TouchableOpacity, Alert } from "react-native";
import { DEVICE, PD, DIMENSION, CHAT_TYPE } from "helper/Consts";
import { Button, AppImage, AppText } from "components";
import { connect } from "react-redux";
import { ICON } from "assets";
import I18n from "helper/locales";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import chatFn from "../Functions";
import Permissions from "react-native-permissions";
import uuid from "uuid";
import { openAlert } from "actions/alertActions";
import { Const, Colors } from "helper";
import ImagePicker from "react-native-image-picker";
import CameraRollPicker from "react-native-camera-roll-picker";
import { Col, Row, Grid } from "react-native-easy-grid";
import ImageResizer from "react-native-image-resizer";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Icon } from "native-base";
const _ = require("lodash");

const TEXT_COLOR = "#7cdcff";
const options = {
    base64: true,
    title: "Select Avatar",
    customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
    storageOptions: {
        skipBackup: true,
        path: "images"
    }
};
class RenderReplyMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

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

    render() {
        const { onPressClose = () => {} } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.titleWrap}>
                        <View style={styles.straightLine}></View>
                        {this.titleRenderContent()}
                        <TouchableOpacity style={styles.closeWrap} onPress={() => onPressClose()}>
                            <Icon name="ios-close" style={{ fontSize: responsiveFontSize(5) }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const STATUS_BAR_HEIGHT = DIMENSION.STATUS_BAR_HEIGHT + DIMENSION.HEADER_HEIGHT;
const TITLE_HEIGHT = 50;

const styles = {
    container: {
        // width: DEVICE.DEVICE_WIDTH,
        // backgroundColor: "transparent",
        // position: "absolute",
        // height: DEVICE.DEVICE_HEIGHT - 60,
        // height: 60,
        // width: 60,
        // backgroundColor: 'red',
        // bottom: 60
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
    modal: {
        zIndex: 1,
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        top: "85%"
    },
    buttonModal: {
        width: "40%"
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
        width: "10%",
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

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
RenderReplyMessage = connect(mapStateToProps)(RenderReplyMessage);
export default RenderReplyMessage;
