import React, { Component } from "react";
import { View, TouchableOpacity, Linking, Keyboard, Platform, Image, Text } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF, ICON } from "assets";
import { PD, DIMENSION, DEVICE, CHAT_TYPE } from "helper/Consts";
import { AppText, AppImage } from "components";
import chatFn from "../Functions";
import { Icon, Spinner, Root } from "native-base";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Colors, Images } from "helper";
import Lightbox from "../../../../library/lib-react-native-lightbox";
import ParsedText from "react-native-parsed-text";
import I18n from "helper/locales";
import { Col, Row, Grid } from "react-native-easy-grid";
import ImageViewer from "react-native-image-zoom-viewer";
const moment = require("moment");
const _ = require("lodash");

const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 8;
const REPLY_SIZE = 1;

class MyBubbleMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            width: 0
        };
        this.urlImage = "";
    }

    handleUrlPress = url => {
        if (url.toLowerCase().includes("http://") || url.toLowerCase().includes("https://")) {
            let newurl = url.split("//")[0].toLowerCase() + url.split("//")[1];
            Linking.openURL(newurl);
        } else {
            let mergedUrl = "https://" + url;
            Linking.openURL(mergedUrl);
        }
    };

    renderTextMessage() {
        const { message, onLongPressMess = () => {} } = this.props;
        let d = new moment(message.createdAt);
        let time = message.forward || message.edit ? d.format("HH:mm  ") : d.format("HH:mm");
        return (
            <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                <ParsedText
                    parse={[
                        { type: "url", style: styles.url, onPress: this.handleUrlPress },
                        {
                            pattern: /[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b/,
                            style: styles.url,
                            onPress: this.handleUrlPress
                        }
                    ]}
                    {...this.props}
                    numberOfLines={this.props.numberOfLines}
                    allowFontScaling={false}
                    style={[
                        styles.message,
                        // AppStyles.fontContent,
                        // { fontFamily: Platform.OS === "android" ? FONTFAMILY_GOTHAM_ANDROID : FONTFAMILY_GOTHAM },
                        this.props.style
                    ]}
                >
                    {message.text}
                </ParsedText>
                <View style={{ marginTop: PD.PADDING_1 }} />
                <AppText text={time} style={styles.time}>
                    {message.forward && (
                        <Icon name="ios-redo" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                    )}
                    {message.edit && (
                        <Icon name="md-create" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                    )}
                </AppText>
            </TouchableOpacity>
        );
    }

    renderTextMessageReplied() {
        const { message, onLongPressMess = () => {} } = this.props;
        let { messageReplied } = message;

        return (
            <TouchableOpacity onLongPress={() => onLongPressMess(messageReplied, true)}>
                <ParsedText
                    parse={[
                        { type: "url", style: styles.url, onPress: this.handleUrlPress },
                        {
                            pattern: /[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b/,
                            style: styles.url,
                            onPress: this.handleUrlPress
                        }
                    ]}
                    {...this.props}
                    numberOfLines={this.props.numberOfLines}
                    allowFontScaling={false}
                    style={[
                        styles.messageReplied,
                        // AppStyles.fontContent,
                        // { fontFamily: Platform.OS === "android" ? FONTFAMILY_GOTHAM_ANDROID : FONTFAMILY_GOTHAM },
                        this.props.style
                    ]}
                >
                    {messageReplied.text}
                </ParsedText>
                <View style={{ marginTop: PD.PADDING_1 }} />
            </TouchableOpacity>
        );
    }

    renderEditTextMessageReplied() {
        const { message, onLongPressMess = () => {} } = this.props;
        const { messageReplied } = message;
        return (
            <TouchableOpacity onLongPress={() => onLongPressMess(messageReplied, true)}>
                <ParsedText
                    parse={[
                        { type: "url", style: styles.url, onPress: this.handleUrlPress },
                        {
                            pattern: /[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b/,
                            style: styles.url,
                            onPress: this.handleUrlPress
                        }
                    ]}
                    {...this.props}
                    numberOfLines={this.props.numberOfLines}
                    allowFontScaling={false}
                    style={[styles.message, this.props.style]}
                >
                    {messageReplied.text}
                </ParsedText>
                <View style={{ marginTop: PD.PADDING_1 }} />
            </TouchableOpacity>
        );
    }

    renderImageMessageReplied() {
        const { message, onLongPressMess = () => {} } = this.props;
        let { messageReplied } = message;
        const { image } = messageReplied;
        const { uri } = image;
        let dimention = chatFn.calculatorHW(messageReplied);
        return (
            <View>
                <Lightbox
                    swipeToDismiss={false}
                    renderHeader={close => this.renderHeader(close)}
                    renderContent={() => this.renderContentImages([{ uri }])}
                    onLongPress={() => onLongPressMess(messageReplied, true)}
                >
                    {this.checkNetWorkImage(uri) ? (
                        <AppImage
                            source={{ uri: uri }}
                            resizeMode="cover"
                            style={{
                                width: dimention.width * REPLY_SIZE,
                                height: dimention.height * REPLY_SIZE,
                                borderRadius: PD.PADDING_5 * REPLY_SIZE
                            }}
                        />
                    ) : (
                        <Image
                            source={{ uri: uri }}
                            resizeMode="cover"
                            style={{
                                width: dimention.width * REPLY_SIZE,
                                height: dimention.height * REPLY_SIZE,
                                borderRadius: PD.PADDING_5 * REPLY_SIZE
                            }}
                        />
                    )}
                </Lightbox>
            </View>
        );
    }

    renderImagesMessageReplied() {
        const { message, onLongPressMess = () => {} } = this.props;
        let { messageReplied } = message;
        const { images } = messageReplied;
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
            <View>
                <View
                    style={{
                        borderRadius: PD.PADDING_2
                        // paddingHorizontal: PD.PADDING_1 / 2,
                        // backgroundColor: "red"
                    }}
                >
                    <View style={{ height: PD.PADDING_1 / 2 }} />
                    <Grid style={{ width: DEVICE.DEVICE_WIDTH * 0.6 * REPLY_SIZE, backgroundColor: "transparent" }}>
                        {listImages.map((el, indexRow) => {
                            return (
                                <Row key={indexRow} style={{ height: 60 * (2.5 - (el.length - 1) / 2) * REPLY_SIZE }}>
                                    {el.map((elc, indexCol) => {
                                        return (
                                            <Col key={indexCol}>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        // backgroundColor: "white",
                                                        padding: PD.PADDING_1 / 4
                                                    }}
                                                >
                                                    <Lightbox
                                                        swipeToDismiss={false}
                                                        renderHeader={close => this.renderHeader(close)}
                                                        renderContent={() =>
                                                            this.renderContentImages(imagess, indexRow * 3 + indexCol)
                                                        }
                                                        onLongPress={() => onLongPressMess(messageReplied, true)}
                                                    >
                                                        {this.checkNetWorkImage(elc.uri) ? (
                                                            <AppImage
                                                                source={{ uri: elc.uri }}
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    borderRadius: PD.PADDING_2
                                                                }}
                                                                resizeMode="cover"
                                                            />
                                                        ) : (
                                                            <Image
                                                                source={{ uri: elc.uri }}
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    borderRadius: PD.PADDING_2
                                                                }}
                                                                resizeMode="cover"
                                                            />
                                                        )}
                                                    </Lightbox>
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
            </View>
        );
    }

    renderFileMessageReplied() {
        const { message, onLongPressMess = () => {} } = this.props;
        const { messageReplied } = message;
        const { file } = messageReplied;
        const { uri, fileName } = file;

        return (
            <View>
                <View
                    style={{
                        paddingHorizontal: PD.PADDING_2 * REPLY_SIZE,
                        paddingVertical: PD.PADDING_1 * REPLY_SIZE,
                        backgroundColor: Colors.MAIN_COLOR
                    }}
                >
                    <TouchableOpacity
                        onPress={() => this.openLink(uri)}
                        onLongPress={() => onLongPressMess(messageReplied, true)}
                        style={{ padding: PD.PADDING_2, justifyContent: "center", alignItems: "center" }}
                    >
                        <Icon
                            type="Ionicons"
                            name="md-document"
                            style={{ fontSize: responsiveFontSize(7 * REPLY_SIZE), color: "#fff" }}
                        />
                        <AppText text={fileName} style={styles.messageReplied} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderLocationMessageReplied() {
        const { message, onLongPressMess = () => {} } = this.props;
        const { messageReplied } = message;
        const { location } = messageReplied;
        let region = {
            latitude: location.currentLatitude,
            longitude: location.currentLongitude,
            latitudeDelta: location.latitudeDelta,
            longitudeDelta: location.longitudeDelta
        };
        let checkHeight = DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH;
        let height = checkHeight < 2 ? DEVICE.DEVICE_HEIGHT * 0.3 : DEVICE.DEVICE_HEIGHT * 0.2;
        let width = DIMENSION.CHAT_BUBBLE_WIDTH;
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.onClickMap(region)}
                    onLongPress={() => onLongPressMess(messageReplied, true)}
                    style={{
                        // height: height,
                        width: width * REPLY_SIZE,
                        alignItems: "center"
                    }}
                >
                    <MapView
                        pointerEvents="none"
                        ref={ref => (this.mapView = ref)}
                        style={{
                            width: (width - PD.PADDING_5) * REPLY_SIZE,
                            height: (height - PD.PADDING_5) * REPLY_SIZE,
                            borderRadius: PD.PADDING_5
                        }}
                        // onPress={() => this.onClickMap(region)}
                        provider={PROVIDER_GOOGLE}
                        region={region}
                        showsUserLocation={false}
                        cacheEnabled={true}
                        liteMode
                        loadingEnabled
                    >
                        {this.renderMarker(location)}
                    </MapView>
                </TouchableOpacity>
            </View>
        );
    }

    renderCardContactReplied() {
        let { message, navigation, onLongPressMess = () => {} } = this.props;
        const { messageReplied } = message;
        const { first_name, last_name } = messageReplied.cardContact.user;
        const nickname = messageReplied.cardContact.name;
        let subject = I18n.t("teacherScreen.noInfo");
        let jobPosition = I18n.t("teacherScreen.noInfo");
        if (!_.isEmpty(messageReplied.cardContact.subjects)) {
            subject = messageReplied.cardContact.subjects[0].name;
        } else if (!_.isEmpty(messageReplied.cardContact.specialize)) {
            subject = messageReplied.cardContact.specialize[0].specialize_topic_name;
        }
        if (!_.isEmpty(messageReplied.cardContact.job_position)) {
            jobPosition = messageReplied.cardContact.job_position.name;
        }
        return (
            <TouchableOpacity
                onLongPress={() => onLongPressMess(messageReplied, true)}
                onPress={() =>
                    navigation.navigate("DetailTeacher", { contact: { teacher: messageReplied.cardContact } })
                }
                style={{ flexDirection: "row", alignItems: "center" }}
            >
                <View style={styles.imageOutLine}>
                    <AppImage
                        source={{ uri: messageReplied.cardContact.avatar }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
                <View style={{ marginLeft: 10 }}>
                    <AppText
                        numberOfLines={1}
                        text={`${I18n.t("teacherScreen.teacher")}${nickname}`}
                        style={[styles.groupName, styles.textWidth]}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AppImage local source={ICON.SUBJECT_ACTIVE} style={styles.icInfo} />
                        <AppText text={subject} style={{ color: Colors.WHITE_COLOR }} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AppImage local source={ICON.JOB_ACTIVE} style={styles.icInfo} />
                        <AppText text={jobPosition} style={{ color: Colors.WHITE_COLOR }} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderFooterReplyMessage() {
        const { message, onLongPressMess = () => {} } = this.props;
        const { messageReplied } = message;
        let d = new moment(message.createdAt);
        let time = message.forward || message.edit ? d.format("HH:mm  ") : d.format("HH:mm");
        let d1 = new moment(messageReplied.createdAt);
        let timeReplied = d1.format(", HH:mm  DD/MM/YYYY");
        return (
            <View>
                <AppText text={messageReplied.user.name + timeReplied} style={styles.timeReplied} />
                <View style={{ paddingTop: PD.PADDING_1, borderTopColor: "white", borderTopWidth: 0.5 }}>
                    <ParsedText
                        parse={[
                            { type: "url", style: styles.url, onPress: this.handleUrlPress },
                            {
                                pattern: /[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b/,
                                style: styles.url,
                                onPress: this.handleUrlPress
                            }
                        ]}
                        {...this.props}
                        numberOfLines={this.props.numberOfLines}
                        allowFontScaling={false}
                        style={[
                            styles.message,
                            // AppStyles.fontContent,
                            // { fontFamily: Platform.OS === "android" ? FONTFAMILY_GOTHAM_ANDROID : FONTFAMILY_GOTHAM },
                            this.props.style
                        ]}
                    >
                        {message.text}
                    </ParsedText>
                    <AppText text={time} style={styles.time}>
                        {message.forward && (
                            <Icon name="ios-redo" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                        )}
                        {message.edit && (
                            <Icon name="md-create" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                        )}
                    </AppText>
                </View>
            </View>
        );
    }

    renderReplyMessage() {
        const { message, onLongPressMess = () => {} } = this.props;
        let { messageReplied } = message;
        switch (messageReplied.type) {
            case CHAT_TYPE.TEXT:
            case CHAT_TYPE.REPLY:
                return (
                    <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                        {this.renderTextMessageReplied()}
                        {this.renderFooterReplyMessage()}
                    </TouchableOpacity>
                );
            case CHAT_TYPE.IMAGE:
                return (
                    <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                        {this.renderImageMessageReplied()}
                        {this.renderFooterReplyMessage()}
                    </TouchableOpacity>
                );
            case CHAT_TYPE.IMAGES:
                return (
                    <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                        {this.renderImagesMessageReplied()}
                        {this.renderFooterReplyMessage()}
                    </TouchableOpacity>
                );
            case CHAT_TYPE.FILE:
                return (
                    <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                        {this.renderFileMessageReplied()}
                        {this.renderFooterReplyMessage()}
                    </TouchableOpacity>
                );
            case CHAT_TYPE.LOCATION:
                return (
                    <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                        {this.renderLocationMessageReplied()}
                        {this.renderFooterReplyMessage()}
                    </TouchableOpacity>
                );
            case CHAT_TYPE.CONTACT:
                return (
                    <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                        {this.renderCardContactReplied()}
                        {this.renderFooterReplyMessage()}
                    </TouchableOpacity>
                );
            case CHAT_TYPE.EDITED_MESSAGE:
                return (
                    <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                        {this.renderEditTextMessageReplied()}
                        {this.renderFooterReplyMessage()}
                    </TouchableOpacity>
                );

            default:
                return null;
        }
    }

    renderEditTextMessage() {
        const { message, onLongPressMess = () => {} } = this.props;
        let d = new moment(message.createdAt);
        let time = d.format("HH:mm");
        return (
            <TouchableOpacity onLongPress={() => onLongPressMess(message)}>
                <ParsedText
                    parse={[
                        { type: "url", style: styles.url, onPress: this.handleUrlPress },
                        {
                            pattern: /[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b/,
                            style: styles.url,
                            onPress: this.handleUrlPress
                        }
                    ]}
                    {...this.props}
                    numberOfLines={this.props.numberOfLines}
                    allowFontScaling={false}
                    style={[styles.message, this.props.style]}
                >
                    {message.text}
                </ParsedText>
                <View style={{ marginTop: PD.PADDING_1 }} />
                <AppText text={`${time}  `} style={styles.time}>
                    <Icon name="md-create" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                </AppText>
            </TouchableOpacity>
        );
    }

    renderDeleteMessage() {
        const { message, onLongPressMess = () => {} } = this.props;
        let d = new moment(message.createdAt);
        let time = d.format("HH:mm");
        return (
            <View onLongPress={() => onLongPressMess(message)}>
                <AppText text={I18n.t("optionFunc.deleted")} style={[styles.messageDelete, this.props.style]} />
                <View style={{ marginTop: PD.PADDING_1 }} />
                <AppText text={time} style={styles.timeDelete} />
            </View>
        );
    }

    renderContent() {
        const { message } = this.props;
        const { image } = message;
        const { uri } = image;
        this.urlImage = uri;
        return (
            <Root>
                <ImageViewer
                    imageUrls={[{ url: uri }]}
                    // index={0}
                    onSwipeDown={() => {}}
                    onMove={data => {}}
                    enableImageZoom={false}
                    // enableSwipeDown={true}
                    // onSave={url => chatFn.download(url)
                    saveToLocalByLongPress={false}
                />
            </Root>
        );
    }

    renderHeader(close) {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: PD.PADDING_1 / 2
                }}
            >
                <TouchableOpacity onPress={() => close()}>
                    <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => chatFn.download(this.urlImage)}>
                    <Icon name="download" style={[styles.downloadButton]} />
                </TouchableOpacity>
            </View>
        );
    }

    checkNetWorkImage(uri) {
        return _.includes(uri, "https://") || _.includes(uri, "http://");
    }

    renderImageMessage() {
        const { message, imageLoading, onLongPressMess = () => {} } = this.props;
        const { image } = message;
        const { uri } = image;
        let dimention = chatFn.calculatorHW(message);
        let d = new moment(message.createdAt);
        let time = message.forward || message.edit ? d.format("HH:mm  ") : d.format("HH:mm");
        let index = imageLoading.findIndex(item => {
            return item._id == message._id;
        });
        return (
            <View>
                <Lightbox
                    swipeToDismiss={false}
                    renderHeader={close => this.renderHeader(close)}
                    renderContent={() => this.renderContent()}
                    onLongPress={() => onLongPressMess(message)}
                >
                    {this.checkNetWorkImage(uri) ? (
                        <AppImage
                            source={{ uri: uri }}
                            resizeMode="cover"
                            style={{ width: dimention.width, height: dimention.height, borderRadius: PD.PADDING_5 }}
                        />
                    ) : (
                        <Image
                            source={{ uri: uri }}
                            resizeMode="cover"
                            style={{ width: dimention.width, height: dimention.height, borderRadius: PD.PADDING_5 }}
                        />
                    )}
                </Lightbox>
                {index > -1 && this.loadingState(dimention.width, dimention.height)}
                <AppText text={time} style={[styles.time, { color: Colors.MAIN_COLOR, marginTop: 8 }]}>
                    {message.forward && (
                        <Icon name="ios-redo" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                    )}
                    {message.edit && (
                        <Icon name="md-create" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                    )}
                </AppText>
            </View>
        );
    }

    renderContentImages(images, index) {
        // const { message } = this.props;
        // const { image } = message;
        // const { uri } = image;
        let data = images.map(el => {
            return { url: el.uri };
        });
        this.urlImage = data[index || 0].url;
        return (
            <Root>
                <ImageViewer
                    imageUrls={data}
                    index={index || 0}
                    onSwipeDown={() => {}}
                    onMove={data => {}}
                    // enableSwipeDown={true}
                    enableImageZoom={false}
                    // onSave={url => chatFn.download(url)}
                    // onSaveToCamera={e => console.log("eeee", e)}
                    saveToLocalByLongPress={false}
                    onChange={index => (this.urlImage = data[index].url)}
                />
            </Root>
        );
    }

    renderImagesMessage() {
        const { message, imageLoading, onLongPressMess = () => {} } = this.props;
        const { images } = message;
        let d = new moment(message.createdAt);
        let time = message.forward || message.edit ? d.format("HH:mm  ") : d.format("HH:mm");
        let index = imageLoading.findIndex(item => {
            return item._id == message._id;
        });
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
            <View>
                <View
                    style={{
                        borderRadius: PD.PADDING_2
                        // paddingHorizontal: PD.PADDING_1 / 2,
                        // backgroundColor: "white"
                    }}
                >
                    {index > -1 && this.loadingState("100%", "100%", PD.PADDING_2)}
                    {/* <View style={{ height: PD.PADDING_1 / 2 }} /> */}
                    <Grid style={{ width: DEVICE.DEVICE_WIDTH * 0.6 }}>
                        {listImages.map((el, indexRow) => {
                            return (
                                <Row key={indexRow} style={{ height: 60 * (2.5 - (el.length - 1) / 2) }}>
                                    {el.map((elc, indexCol) => {
                                        return (
                                            <Col key={indexCol}>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        // backgroundColor: "white",
                                                        padding: PD.PADDING_1 / 4
                                                    }}
                                                >
                                                    <Lightbox
                                                        swipeToDismiss={false}
                                                        renderHeader={close => this.renderHeader(close)}
                                                        renderContent={() =>
                                                            this.renderContentImages(imagess, indexRow * 3 + indexCol)
                                                        }
                                                        onLongPress={() => onLongPressMess(message)}
                                                    >
                                                        {this.checkNetWorkImage(elc.uri) ? (
                                                            <AppImage
                                                                source={{ uri: elc.uri }}
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    borderRadius: PD.PADDING_2
                                                                }}
                                                                resizeMode="cover"
                                                            />
                                                        ) : (
                                                            <Image
                                                                source={{ uri: elc.uri }}
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    borderRadius: PD.PADDING_2
                                                                }}
                                                                resizeMode="cover"
                                                            />
                                                        )}
                                                    </Lightbox>
                                                </View>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            );
                        })}
                    </Grid>
                    {/* <View style={{ height: PD.PADDING_1 / 2 }} /> */}
                </View>
                <AppText text={time} style={[styles.time, { color: Colors.MAIN_COLOR, marginTop: 8 }]}>
                    {message.forward && (
                        <Icon
                            name="ios-redo"
                            style={[styles.time, { fontSize: responsiveFontSize(2), color: Colors.MAIN_COLOR }]}
                        />
                    )}
                    {message.edit && (
                        <Icon
                            name="md-create"
                            style={[styles.time, { fontSize: responsiveFontSize(2), color: Colors.MAIN_COLOR }]}
                        />
                    )}
                </AppText>
            </View>
        );
    }

    loadingState(width, height, borderRadius) {
        return (
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width,
                    height,
                    borderRadius: borderRadius || PD.PADDING_5,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1
                }}
            >
                <Spinner color={Colors.WHITE_COLOR} />
            </View>
        );
    }

    loadingStateFile(width, height) {
        return (
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width,
                    height,
                    borderRadius: PD.PADDING_5,
                    borderTopRightRadius: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1
                }}
            >
                <Spinner color={Colors.WHITE_COLOR} />
            </View>
        );
    }

    openLink(url) {
        Linking.openURL(url);
    }

    renderFileMessage() {
        const { message, imageLoading, onLongPressMess = () => {} } = this.props;
        const { file } = message;
        const { uri, fileName } = file;
        let d = new moment(message.createdAt);
        let time = message.forward || message.edit ? d.format("HH:mm  ") : d.format("HH:mm");
        let index = imageLoading.findIndex(item => {
            return item._id == message._id;
        });
        return (
            <View>
                {index > -1 && this.loadingStateFile("100%", "100%")}
                <View
                    style={{
                        paddingHorizontal: PD.PADDING_2,
                        paddingVertical: PD.PADDING_1,
                        backgroundColor: Colors.MAIN_COLOR,
                        borderBottomLeftRadius: PD.PADDING_5,
                        borderTopLeftRadius: PD.PADDING_5,
                        borderBottomRightRadius: PD.PADDING_5
                    }}
                >
                    <TouchableOpacity
                        onPress={() => this.openLink(uri)}
                        onLongPress={() => onLongPressMess(message)}
                        style={{ padding: PD.PADDING_2, justifyContent: "center", alignItems: "center" }}
                    >
                        <Icon
                            type="Ionicons"
                            name="md-document"
                            style={{ fontSize: responsiveFontSize(7), color: "#fff" }}
                        />
                        <AppText text={fileName} style={styles.message} />
                    </TouchableOpacity>
                    <AppText text={time} style={[styles.time]}>
                        {message.forward && (
                            <Icon name="ios-redo" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                        )}
                        {message.edit && (
                            <Icon name="md-create" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                        )}
                    </AppText>
                </View>
            </View>
        );
    }

    renderMarker(location) {
        let coords = {
            latitude: location.currentLatitude,
            longitude: location.currentLongitude,
            latitudeDelta: location.latitudeDelta,
            longitudeDelta: location.longitudeDelta
        };
        return (
            <Marker onPress={(coordinate, position) => onPress(coordinate, position)} coordinate={coords}>
                <Icon type="Ionicons" name="pin" style={{ color: Colors.MAIN_COLOR }} />
            </Marker>
        );
    }

    onClickMap(region) {
        Keyboard.dismiss();
        let destination = `${region.latitude},${region.longitude}`;
        let scheme =
            Platform.OS === "android"
                ? `http://maps.google.com/maps?q=${destination}`
                : `http://maps.apple.com/?q=${destination}`;
        // ? `https://maps.google.com/?saddr=My+Location&daddr=${destination}`
        // : `http://maps.apple.com/?saddr=My+Location&daddr=${destination}`;
        Linking.canOpenURL(scheme).then(supported => {
            if (supported) {
                Linking.openURL(scheme);
            } else {
            }
        });
    }

    renderLocationMessage() {
        const { message, onLongPressMess = () => {} } = this.props;
        const { location } = message;
        let region = {
            latitude: location.currentLatitude,
            longitude: location.currentLongitude,
            latitudeDelta: location.latitudeDelta,
            longitudeDelta: location.longitudeDelta
        };
        let checkHeight = DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH;
        let d = new moment(message.createdAt);
        let time = message.forward || message.edit ? d.format("HH:mm  ") : d.format("HH:mm");
        let height = checkHeight < 2 ? DEVICE.DEVICE_HEIGHT * 0.3 : DEVICE.DEVICE_HEIGHT * 0.2;
        let width = DIMENSION.CHAT_BUBBLE_WIDTH;
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.onClickMap(region)}
                    onLongPress={() => onLongPressMess(message)}
                    style={{
                        // height: height,
                        width: width,
                        alignItems: "flex-end"
                    }}
                >
                    <MapView
                        pointerEvents="none"
                        ref={ref => (this.mapView = ref)}
                        style={{
                            width: width - PD.PADDING_5,
                            height: height - PD.PADDING_5,
                            borderRadius: PD.PADDING_5
                        }}
                        // onPress={() => this.onClickMap(region)}
                        provider={PROVIDER_GOOGLE}
                        region={region}
                        showsUserLocation={false}
                        cacheEnabled={true}
                        liteMode
                        loadingEnabled
                    >
                        {this.renderMarker(location)}
                    </MapView>
                </TouchableOpacity>
                <AppText text={time} style={[styles.time, { color: Colors.MAIN_COLOR, marginTop: PD.PADDING_1 }]}>
                    {message.forward && (
                        <Icon name="ios-redo" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                    )}
                    {message.edit && (
                        <Icon name="md-create" style={[styles.time, { fontSize: responsiveFontSize(2) }]} />
                    )}
                </AppText>
            </View>
        );
    }

    renderCardContact() {
        let { message, navigation, onLongPressMess = () => {} } = this.props;
        const { first_name, last_name } = message.cardContact.user;
        const nickname = message.cardContact.name;
        let subject = I18n.t("teacherScreen.noInfo");
        let jobPosition = I18n.t("teacherScreen.noInfo");
        if (!_.isEmpty(message.cardContact.subjects)) {
            subject = message.cardContact.subjects[0].name;
        } else if (!_.isEmpty(message.cardContact.specialize)) {
            subject = message.cardContact.specialize[0].specialize_topic_name;
        }
        if (!_.isEmpty(message.cardContact.job_position)) {
            jobPosition = message.cardContact.job_position.name;
        }
        return (
            <TouchableOpacity
                onLongPress={() => onLongPressMess(message)}
                onPress={() => navigation.navigate("DetailTeacher", { contact: { teacher: message.cardContact } })}
                style={{ flexDirection: "row", alignItems: "center" }}
            >
                <View style={styles.imageOutLine}>
                    <AppImage source={{ uri: message.cardContact.avatar }} style={styles.image} resizeMode="cover" />
                </View>
                <View style={{ marginLeft: 10 }}>
                    <AppText
                        numberOfLines={1}
                        text={`${I18n.t("teacherScreen.teacher")}${nickname}`}
                        style={[styles.groupName, styles.textWidth]}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AppImage local source={ICON.SUBJECT_ACTIVE} style={styles.icInfo} />
                        <AppText text={subject} style={{ color: Colors.WHITE_COLOR }} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AppImage local source={ICON.JOB_ACTIVE} style={styles.icInfo} />
                        <AppText text={jobPosition} style={{ color: Colors.WHITE_COLOR }} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderMessage() {
        let { message } = this.props;

        if (_.isNumber(message.deleteId)) {
            return <View style={styles.containerDelete}>{this.renderDeleteMessage()}</View>;
        } else {
            switch (message.type) {
                case CHAT_TYPE.TEXT:
                    return <View style={styles.container}>{this.renderTextMessage()}</View>;
                case CHAT_TYPE.REPLY:
                    return <View style={styles.container}>{this.renderReplyMessage()}</View>;
                case CHAT_TYPE.IMAGE:
                    return <View style={styles.containerImage}>{this.renderImageMessage()}</View>;
                case CHAT_TYPE.IMAGES:
                    return <View style={styles.containerImage}>{this.renderImagesMessage()}</View>;
                case CHAT_TYPE.FILE:
                    return <View style={styles.containerFile}>{this.renderFileMessage()}</View>;
                case CHAT_TYPE.LOCATION:
                    return <View style={styles.containerImage}>{this.renderLocationMessage()}</View>;
                case CHAT_TYPE.CONTACT:
                    return <View style={styles.container}>{this.renderCardContact()}</View>;
                case CHAT_TYPE.DELETE_MESSAGE:
                    return <View style={styles.containerDelete}>{this.renderDeleteMessage()}</View>;
                case CHAT_TYPE.EDITED_MESSAGE:
                    return <View style={styles.container}>{this.renderEditTextMessage()}</View>;

                default:
                    return null;
            }
        }
    }

    render() {
        return this.renderMessage();
    }
}

const styles = {
    container: {
        backgroundColor: Colors.MAIN_COLOR,
        borderBottomLeftRadius: PD.PADDING_4,
        borderTopLeftRadius: PD.PADDING_4,
        borderBottomRightRadius: PD.PADDING_4,
        paddingVertical: PD.PADDING_2,
        paddingHorizontal: PD.PADDING_2,
        maxWidth: DIMENSION.CHAT_BUBBLE_WIDTH,
        marginRight: 12,
        marginVertical: PD.PADDING_1
    },
    containerDelete: {
        backgroundColor: "lightgrey",
        borderBottomLeftRadius: PD.PADDING_4,
        borderTopLeftRadius: PD.PADDING_4,
        borderBottomRightRadius: PD.PADDING_4,
        paddingVertical: PD.PADDING_2,
        paddingHorizontal: PD.PADDING_2,
        maxWidth: DIMENSION.CHAT_BUBBLE_WIDTH,
        marginRight: 12,
        marginVertical: PD.PADDING_1
    },
    containerImage: {
        borderRadius: PD.PADDING_4,
        maxWidth: DIMENSION.CHAT_BUBBLE_WIDTH,
        marginRight: 12,
        marginVertical: PD.PADDING_1
    },
    containerFile: {
        backgroundColor: "transparent",
        maxWidth: DIMENSION.CHAT_BUBBLE_WIDTH,
        marginRight: 12,
        marginVertical: PD.PADDING_1
    },
    message: {
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveFontSize(2.5),
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.REGULAR,
        textAlign: "left"
    },
    messageReplied: {
        fontSize: responsiveFontSize(2 * REPLY_SIZE),
        lineHeight: responsiveFontSize(2.2),
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.REGULAR,
        textAlign: "left"
    },
    messageDelete: {
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveFontSize(2.5),
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.REGULAR,
        textAlign: "right"
    },
    time: {
        fontSize: responsiveFontSize(1.5),
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.REGULAR,
        textAlign: "right"
    },
    timeReplied: {
        fontSize: responsiveFontSize(1.5 * REPLY_SIZE),
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.REGULAR,
        textAlign: "right"
    },
    timeDelete: {
        fontSize: responsiveFontSize(1.5),
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.REGULAR,
        textAlign: "right"
    },
    url: {
        color: Colors.WHITE_COLOR,
        textDecorationLine: "underline"
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
        fontSize: responsiveFontSize(2),
        lineHeight: responsiveFontSize(2.5),
        fontFamily: FONT_SF.MEDIUM,
        color: Colors.WHITE_COLOR
    },
    icInfo: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    textWidth: {
        width: DIMENSION.CHAT_BUBBLE_WIDTH * 0.6
    },
    closeButton: {
        fontSize: 35,
        color: "white",
        lineHeight: 40,
        width: 40,
        textAlign: "center",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 1.5,
        shadowColor: "black",
        shadowOpacity: 0.8
    },
    downloadButton: {
        fontSize: 25,
        color: "white",
        lineHeight: 40,
        width: 40,
        textAlign: "right",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 1.5,
        shadowColor: "black",
        shadowOpacity: 0.8,
        marginRight: PD.PADDING_4
    }
};

export default MyBubbleMessage;
