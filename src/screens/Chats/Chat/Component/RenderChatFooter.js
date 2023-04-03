import React, { Component } from "react";
import { View, ScrollView, Platform, Modal, TouchableOpacity, Alert } from "react-native";
import { DEVICE, PD, DIMENSION, permissions, resultPermission } from "helper/Consts";
import { Button, AppImage, AppText } from "components";
import { connect } from "react-redux";
import { ICON } from "assets";
import I18n from "helper/locales";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import chatFn from "../Functions";
import Permissions, { openSettings } from "react-native-permissions";
import uuid from "uuid";
import { openAlert } from "actions/alertActions";
import { Const, Colors, ServiceHandle } from "helper";
import ImagePicker from "react-native-image-picker";
import CameraRollPicker from "react-native-camera-roll-picker";
import { Col, Row, Grid } from "react-native-easy-grid";
import ImageResizer from "react-native-image-resizer";
import OpenAppSettings from "react-native-app-settings";
import { Icon } from "native-base";
import Geolocation from "@react-native-community/geolocation";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

const _ = require("lodash");
const CryptoJS = require("crypto-js");

const TEXT_COLOR = Colors.WHITE_COLOR;
const options = {
    base64: true,
    title: "Select Avatar",
    customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
    storageOptions: {
        skipBackup: true,
        path: "images"
    }
};
class RenderChatFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            images: [],
            showAlert: false
        };
        this.imagesPicker = 0;
    }

    loadingFile(data, id, isImage) {
        let { onLoadingImage = () => {}, user, lastMessage } = this.props;
        let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        if (isImage) {
            onLoadingImage(chatFn.convertMessImage(data.uri, data, user, index, id));
        } else {
            onLoadingImage(chatFn.convertFileMessage(data.uri, data, user, index, id));
            // onLoadingImage(chatFn.convertMessImage(data.uri, data, user, index, id));
        }
    }

    onSendFile() {
        let { onPress = () => {} } = this.props;
        onPress();
        DocumentPicker.show(
            {
                filetype: [DocumentPickerUtil.allFiles()]
            },
            async (error, res) => {
                let fileSizeMB = res.fileSize / 1024 / 1024;
                if (fileSizeMB > 50) {
                    Alert.alert(
                        I18n.t("Alert.notice"),
                        I18n.t("Alert.fileOutSize"),
                        [
                            {
                                text: "OK",
                                onPress: () => {},
                                style: { color: "red" }
                            }
                        ],
                        { cancelable: false }
                    );
                    return;
                }
                if (!_.isEmpty(res)) {
                    Alert.alert(
                        I18n.t("Alert.notice"),
                        I18n.t("Alert.sendFile"),
                        [
                            {
                                text: I18n.t("optionFunc.cancel"),
                                onPress: () => {},
                                style: "cancel"
                            },
                            {
                                text: "OK",
                                onPress: () => this.onConfirmSendFile(res),
                                style: { color: "red" }
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        );
    }

    async onConfirmSendFile(res) {
        let { onSendFile = () => {}, user, lastMessage } = this.props;
        let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        let id = uuid.v4();
        let dataSplitDot = res.fileName.split(".");
        let filetype = dataSplitDot[dataSplitDot.length - 1];
        const IMAGE_TYPE = ["png", "jpeg", "jpg", "heic", "gif"];
        let isImage = _.includes(IMAGE_TYPE, filetype);
        this.loadingFile(res, id, isImage);
        // upload file

        const fileUP1 = new FormData();
        fileUP1.append("file", {
            uri: res.uri,
            type: res.type,
            name: res.fileName
        });

        const responseNew = await ServiceHandle.uploadImage(fileUP1);
        if (_.isEmpty(responseNew)) {
        } else {
            let url = `${Const.HOST_IMAGE}${responseNew.file}`;
            if (isImage) {
                onSendFile(chatFn.convertMessImage(url, res, user, index, id));
            } else {
                onSendFile(chatFn.convertFileMessage(url, res, user, index, id));
            }
        }

        // const fileUP = new FormData();
        // fileUP.append({ name: "file", filename: "vid.mp4", data: RNFetchBlob.wrap(res.uri) });
        // const blob = await new Promise((resolve, reject) => {
        //     const xhr = new XMLHttpRequest();
        //     xhr.onload = () => {
        //         resolve(xhr.response);
        //     };
        //     xhr.onerror = e => {
        //         reject(new TypeError("Network request failed"));
        //     };
        //     xhr.responseType = "blob";
        //     xhr.open("GET", res.uri, true);
        //     xhr.send(null);
        // });

        // this.uploadImageToFireBase(blob, res, isImage, id);
    }

    // uploadImageToFireBase(file, data, isImage, id) {
    //     let { onSendFile = () => {}, user, lastMessage } = this.props;
    //     let fileName = `chat/file/${user.id}-${id}`;
    //     var metadata = {
    //         contentType: data.type
    //     };
    //     let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
    //     firebase
    //         .storage()
    //         .ref(fileName)
    //         .put(file, metadata)
    //         .then(function(snapshot) {
    //             firebase
    //                 .storage()
    //                 .ref(fileName)
    //                 .getDownloadURL()
    //                 .then(url => {
    //                     // let filetype = data.fileName.split(".")[data.type.split(".").length - 1];
    //                     // let filetype = data.type.split("/")[0];
    //                     // if (filetype.toLowerCase() == "image") {
    //                     if (isImage) {
    //                         onSendFile(chatFn.convertMessImage(url, data, user, index, id));
    //                     } else {
    //                         onSendFile(chatFn.convertFileMessage(url, data, user, index, id));
    //                     }
    //                 });
    //         });
    // }

    onSendPosition() {
        let { onSendPosition = () => {} } = this.props;
        Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.requestLocation"), [
            {
                text: I18n.t("Alert.cancel"),
                style: "cancel"
            },
            { text: "OK", onPress: () => this.getCurrentLocation() }
        ]);
        // onSendPosition();
    }

    onSendGif() {
        let { onSendGif = () => {} } = this.props;
        onSendGif();
    }
    modalLocation() {
        const { showAlert } = this.state;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showAlert}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                }}
            >
                <View style={styles.containerModal}>
                    <View style={styles.contentModal}>
                        <View style={styles.headerModal}>
                            <View style={[styles.headerImage, { backgroundColor: Colors.YELLOW_COLOR }]}>
                                <Icon name="ios-information" style={{ fontSize: 50, color: "white" }} />
                            </View>
                        </View>
                        <View style={styles.bodyModal}>
                            <AppText text={I18n.t("Alert.notice")} style={styles.titleAlert} />
                            <AppText text={I18n.t("Alert.permissionLocation")} style={styles.contentAlert} />
                            <Button
                                style={{ width: 150, height: 40 }}
                                title={"OK"}
                                onPress={() => {
                                    this.setState({ showAlert: false }), OpenAppSettings.open();
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
    checkAndroidLocation(error) {
        if (error != "No location provider available." || Platform.OS == "ios") return;
        // const { checkPositionAndroid } = this.state;
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(data => {
                this.getCurrentLocation();
                // this.setState({ checkPositionAndroid: true });
            })
            .catch(err => {
                console.log("checkLocation ==> FALSE", err);
                // this.setState({ checkPositionAndroid: false });
            });
    }
    getNSendLocation() {
        let { dispatch } = this.props;
        const paramsAlert = {
            content: I18n.t("Alert.permissionLocation"),
            title: I18n.t("Alert.notice"),
            type: Const.ALERT_TYPE.WARNING
        };
        let { user, onSendFile = () => {}, lastMessage } = this.props;
        let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        Geolocation.getCurrentPosition(
            position => {
                let currentLatitude = position.coords.latitude;
                let currentLongitude = position.coords.longitude;
                let params = {
                    currentLatitude,
                    currentLongitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                };
                onSendFile(chatFn.covertMessLocation(params, user, index));
            },
            error => {
                Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.turnOnLocation"), [
                    {
                        text: I18n.t("Alert.cancel"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.checkAndroidLocation(error.message) }
                ]);
            },
            // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            { enableHighAccuracy: Platform.OS != "android", timeout: 3000 }
        );
    }

    getCurrentLocation() {
        let { onPress = () => {}, permissionError = () => {}, dispatch } = this.props;
        onPress();
        const paramsAlert = {
            content: I18n.t("Alert.permissionLocation"),
            title: I18n.t("Alert.notice"),
            type: Const.ALERT_TYPE.WARNING
        };
        Permissions.request(permissions.LOCATION).then(response => {
            if (response == resultPermission.GRANTED) {
                this.getNSendLocation();
            } else if (response == resultPermission.BLOCKED) {
                this.setState({ showAlert: true });
            } else if (response == resultPermission.DENIED) {
                dispatch(openAlert(paramsAlert));
                // if (Platform.OS === "android") {
                //     Permissions.request(permissions.LOCATION).then(response => {
                //         if (response == resultPermission.GRANTED) {
                //             this.getNSendLocation();
                //         } else {
                //             dispatch(openAlert(paramsAlert));
                //         }
                //     });
                // } else {
                //     this.getNSendLocation();
                // }
            } else if (response == "unavailable") {
                if (Platform.OS === "ios") {
                    Alert.alert(
                        I18n.t("Alert.openSetting"),
                        I18n.t("Alert.locationOff"),
                        [
                            {
                                text: I18n.t("Alert.no"),
                                onPress: () => {},
                                style: "cancel"
                            },
                            { text: I18n.t("Alert.openSetting"), onPress: () => openSettings() }
                        ],
                        { cancelable: false }
                    );
                }
            }
        });
    }

    renderLeftIcon(icon) {
        return <AppImage local source={icon} style={{ height: 23, width: 23 }} resizeMode="contain" />;
    }

    loadingImage(data, id) {
        let { onLoadingImage = () => {}, user, lastMessage } = this.props;
        let { images } = this.state;
        let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        if (!_.isEmpty(images) && images.length > 1) {
            onLoadingImage(chatFn.convertMessImages(images, user, index, id));
        } else {
            onLoadingImage(chatFn.convertMessImage(data.uri, data, user, index, id));
        }
    }

    onOpenCamera() {
        // let { showAddition } = this.props;
        // if (showAddition) {
        //     this.onOpenAddition();
        // }
        ImagePicker.launchCamera(options, async response => {
            if (response.data) {
                let id = uuid.v4();
                let { lastMessage } = this.props;
                let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
                this.loadingImage(response, id, index);
                if (response.fileSize > 1500000) {
                    this.compressImage(response, id, index);
                } else {
                    this.toBlob(response, response, id, index);
                }
            }
        });
    }

    onOpenLibrary() {
        // let { showAddition } = this.props;
        // if (showAddition) {
        //     this.onOpenAddition();
        // }
        // RNfirebase.crashlytics().log("onOpenLibrary");
        // ImagePicker.launchImageLibrary(options, response => {
        //     // RNfirebase.crashlytics().log("ImagePicker.launchImageLibrary");
        //     if (response.data) {
        //         // RNfirebase.crashlytics().log("response.data", response);
        //         try {
        //             let id = uuid.v4();
        //             let { lastMessage } = this.props;
        //             let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        //             this.loadingImage(response, id, index);
        //             if (response.fileSize > 1500000) {
        //                 // RNfirebase.crashlytics().log("response.fileSize > 1500000");
        //                 this.compressImage(response, id, index);
        //             } else {
        //                 // RNfirebase.crashlytics().log("response.fileSize");

        //                 this.toBlob(response, response, id, index);
        //             }
        //         } catch (error) {
        //             // RNfirebase.crashlytics().log("error", error);
        //         }
        //     } else {
        //         // alert("null");
        //     }
        // });

        // this.pickMultiple();

        const { dispatch } = this.props;

        const paramsAlert = {
            content: I18n.t("Alert.permissionImage"),
            title: I18n.t("Alert.notice"),
            type: Const.ALERT_TYPE.WARNING
        };

        const permission = permissions.PHOTO_LIBRARY;

        Permissions.check(permission)
            .then(response => {
                if (response == resultPermission.GRANTED) {
                    this.setState({
                        visible: true,
                        images: []
                    });
                } else if (response == resultPermission.DENIED) {
                    dispatch(openAlert(paramsAlert));
                    setTimeout(() => {
                        Permissions.request(permission).then(response => {
                            if (response == resultPermission.GRANTED) {
                                this.setState({
                                    visible: true,
                                    images: []
                                });
                            } else {
                                dispatch(openAlert(paramsAlert));
                            }
                        });
                    }, 2000);
                } else {
                    if (Platform.OS === "android") {
                        Permissions.request(permission).then(response => {
                            if (response == resultPermission.GRANTED) {
                                this.setState({
                                    visible: true,
                                    images: []
                                });
                            } else {
                                dispatch(openAlert(paramsAlert));
                            }
                        });
                    } else {
                        this.setState({
                            visible: true,
                            images: []
                        });
                    }
                }
            })
            .catch(error => console.log("error library", error));
    }

    compressImage(result, id, index) {
        const size = 800;

        let width = 0;
        let height = 0;
        if (result.width / result.height > 1) {
            width = size;
            height = (size * result.height) / result.width;
        } else {
            height = size;
            width = (size * result.width) / result.height;
        }
        ImageResizer.createResizedImage(
            result.uri,
            width,
            height,
            "PNG",
            100
            // rotation,
            // outputPath
        ).then(response => {
            this.toBlob(result, response, id, index);
        });
    }

    async toBlob(result, response, id, index) {
        let { onSendImage = () => {}, user, lastMessage, sendImageError = () => {} } = this.props;

        // ANOTHER
        // code a Hai

        const fileUP1 = new FormData();
        fileUP1.append("file", {
            uri: response.uri,
            type: "image/png",
            name: `${id}.png`
        });
        const responseNew = await ServiceHandle.uploadImage(fileUP1);
        if (_.isEmpty(responseNew) || !_.isObject(responseNew)) {
            sendImageError(id);
        } else {
            let url = `${Const.HOST_IMAGE}${responseNew.file}`;
            onSendImage(chatFn.convertMessImage(url, result, user, index, id));
        }

        // const fileUP = new FormData();
        // fileUP.append("image", {
        //     uri: response.uri,
        //     type: "image/png",
        //     name: id
        // });

        // fetch("https://api.imgur.com/3/image", {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "multipart/form-data",
        //         Authorization: "Client-ID 51308d40671c473"
        //     },
        //     body: fileUP
        // })
        //     .then(response => response.json())
        //     .then(responseJson => {
        //         if (responseJson.status == 200) {
        //             onSendImage(chatFn.convertMessImage(responseJson.data.link, result, user, index, id));
        //         } else {
        //             sendImageError(id);
        //         }
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         sendImageError(id);
        //     });
    }

    getSelectedImages(images, current) {
        this.setState({
            images
        });
        if (images.length < 9) this.imagesPicker = images.length;
        else this.imagesPicker++;
        if (this.imagesPicker > 9 && images.length == 9)
            Alert.alert(
                I18n.t("Alert.notice"),
                I18n.t("Alert.imageMax"),
                [
                    {
                        text: "OK",
                        onPress: () => {},
                        style: { color: "red" }
                    }
                ],
                { cancelable: false }
            );
    }

    onCancel() {
        let images = [];
        this.setState({
            images,
            visible: false
        });
        this.imagesPicker = 0;
    }

    onConfirm() {
        const { onSendImage = () => {}, lastMessage, user, sendImageError = () => {} } = this.props;
        let { images } = this.state;
        const size = 800;
        let id = uuid.v4();
        let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        let listImages = [];
        this.setState({
            visible: false
        });

        // this.toBlob();
        if (images.length == 1) {
            let response = images[0];
            response.type = "image/png";
            this.loadingImage(response, id);

            if (response.width > 1280 || response.height > 1280) {
                this.compressImage(response, id, index);
            } else {
                this.toBlob(response, response, id, index);
            }
            return;
        }

        this.loadingImage(images, id);

        let result = images.map(async (el, index) => {
            let width = 0;
            let height = 0;
            if (el.width / el.height > 1) {
                width = size;
                height = (size * el.height) / el.width;
            } else {
                height = size;
                width = (size * el.width) / el.height;
            }
            await ImageResizer.createResizedImage(
                el.uri,
                width,
                height,
                "PNG",
                100
                // rotation,
                // outputPath
            ).then(async response => {
                let _id = uuid.v4();
                const fileUP1 = new FormData();
                fileUP1.append("file", {
                    uri: response.uri,
                    type: "image/png",
                    name: `${_id}.png`
                    // name: response.name
                });
                const responseNew = await ServiceHandle.uploadImage(fileUP1);
                if (_.isEmpty(responseNew) || !_.isObject(responseNew)) {
                    return;
                } else {
                    let url = `${Const.HOST_IMAGE}${responseNew.file}`;
                    listImages.push({
                        uri: url,
                        height,
                        width
                    });
                }

                // const fileUP = new FormData();
                // fileUP.append("image", {
                //     uri: response.uri,
                //     type: "image/png"
                // });

                // await fetch("https://api.imgur.com/3/image", {
                //     method: "POST",
                //     headers: {
                //         Accept: "application/json",
                //         "Content-Type": "multipart/form-data",
                //         Authorization: "Client-ID 51308d40671c473"
                //     },
                //     body: fileUP
                // })
                //     .then(response => response.json())
                //     .then(responseJson => {
                //         listImages.push({
                //             uri: responseJson.data.link,
                //             height: responseJson.data.height,
                //             width: responseJson.data.width
                //         });
                //     })
                //     .catch(error => {
                //         console.log(error);
                //         sendImageError(id);
                //     });
            });
        });

        Promise.all(result).then(() => {
            if (listImages.length < images.length) {
                sendImageError(id);
            } else {
                onSendImage(chatFn.convertMessImages(listImages, user, index, id));
            }
            this.setState({
                images: []
            });
            this.imagesPicker = 0;
        });
    }

    render() {
        let { onPress = () => {}, onSendFile = () => {}, onSendPosition = () => {} } = this.props;
        let { visible, images } = this.state;
        let amount = !_.isEmpty(images) && images.length < 2 ? "" : "(" + images.length + ")";
        return (
            <View style={styles.container}>
                {/* <TouchableWithoutFeedback onPress={() => onPress()}>
                    <View style={styles.topContent} />
                </TouchableWithoutFeedback> */}
                <View style={styles.content}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Button
                            renderLeftIcon={this.renderLeftIcon(ICON.CAMERA_ACTIVE)}
                            title={I18n.t("chat.capture")}
                            onPress={() => this.onOpenCamera()}
                            style={styles.buttonSecondary}
                        />
                        <Button
                            renderLeftIcon={this.renderLeftIcon(ICON.IMAGE)}
                            title={I18n.t("chat.picture")}
                            onPress={() => this.onOpenLibrary()}
                            style={styles.buttonSecondary}
                        />
                        {/* <Button
                            renderLeftIcon={this.renderLeftIcon(ICON.EMOJI)}
                            title={I18n.t("chat.emoji")}
                            tStyle={{ color: TEXT_COLOR }}
                            onPress={() => {}}
                            style={styles.buttonSecondary}
                        /> */}
                        <Button
                            renderLeftIcon={this.renderLeftIcon(ICON.CHAT_FILE)}
                            title={I18n.t("chat.sendFile")}
                            onPress={() => this.onSendFile()}
                            style={styles.buttonSecondary}
                        />
                        <Button
                            renderLeftIcon={this.renderLeftIcon(ICON.IC_LOCATION)}
                            title={I18n.t("chat.sendLocation")}
                            onPress={() => this.onSendPosition()}
                            style={styles.buttonSecondary}
                        />
                        <Button
                            renderLeftIcon={this.renderLeftIcon(ICON.CHAT_GIPHY)}
                            title={I18n.t("chat.sendGif")}
                            onPress={() => this.onSendGif()}
                            style={styles.buttonSecondary}
                        />
                    </ScrollView>
                </View>

                <Modal visible={visible} animationType="slide" transparent>
                    <View style={styles.modal}>
                        <Button
                            title={I18n.t("button.cancel")}
                            onPress={() => this.onCancel()}
                            style={[
                                styles.buttonModal,
                                { backgroundColor: Colors.SKY_BLUE },
                                _.isEmpty(images) && { width: "87%" }
                            ]}
                            tStyle={{ color: Colors.BLACK_TEXT_COLOR }}
                        />
                        {!_.isEmpty(images) && (
                            <Button
                                title={I18n.t("button.send") + amount}
                                onPress={() => this.onConfirm()}
                                style={styles.buttonModal}
                            />
                        )}
                    </View>
                    <CameraRollPicker
                        // groupTypes="Library"
                        groupTypes="All"
                        maximum={9}
                        selected={images}
                        assetType="Photos"
                        imagesPerRow={3}
                        imageMargin={5}
                        callback={(images, current) => this.getSelectedImages(images, current)}
                        // backgroundColor={Colors.MAIN_COLOR}
                    />
                </Modal>
                {this.modalLocation()}
            </View>
        );
    }
}

const STATUS_BAR_HEIGHT = DIMENSION.STATUS_BAR_HEIGHT + DIMENSION.HEADER_HEIGHT;

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
        // position: "absolute",
        // bottom: 60,
        height: 60,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
        flexDirection: "row",
        paddingHorizontal: PD.PADDING_4
        // justifyContent: "flex-start",
        // alignItems: "center"
    },
    topContent: {
        // marginTop: STATUS_BAR_HEIGHT,
        // backgroundColor: "rgba(0,0,0,0.2)",
        // height: DEVICE.DEVICE_HEIGHT - STATUS_BAR_HEIGHT - 60
    },
    buttonPrimary: {
        marginRight: PD.PADDING_4,
        backgroundColor: Colors.MAIN_COLOR,
        paddingHorizontal: PD.PADDING_3,
        height: DIMENSION.BUTTON_HEIGHT * 0.9
    },
    buttonSecondary: {
        marginRight: PD.PADDING_4,
        // backgroundColor: "#FDD8BB",
        backgroundColor: Colors.MAIN_COLOR,
        paddingHorizontal: PD.PADDING_3,
        height: DIMENSION.BUTTON_HEIGHT * 0.9
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
    containerModal: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    contentModal: {
        marginTop: "20%",
        alignItems: "center",
        witdh: "80%"
    },
    headerModal: {
        width: 60,
        height: 60,
        justifyContent: "center",
        borderRadius: 30,
        borderColor: "white",
        alignItems: "center",
        backgroundColor: Colors.WHITE_COLOR,
        zIndex: 999
    },
    bodyModal: {
        marginTop: -30,
        backgroundColor: "white",
        padding: 16,
        width: "80%",
        borderRadius: 5,
        alignItems: "center"
    },
    headerImage: {
        width: 50,
        height: 50,
        justifyContent: "center",
        borderRadius: 25,
        alignItems: "center"
    },
    titleAlert: {
        fontSize: Const.FONT_SIZE.TITLE,
        marginTop: 16,
        fontWeight: "500",
        color: "black"
    },
    contentAlert: {
        width: "80%",
        fontSize: Const.FONT_SIZE.CONTENT_SIZE + 2,
        marginTop: 6,
        textAlign: "center",
        marginBottom: 16,
        color: "black"
    }
};

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
RenderChatFooter = connect(mapStateToProps)(RenderChatFooter);
export default RenderChatFooter;
