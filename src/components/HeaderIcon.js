import React from "react";
import { ImageBackground, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Colors, Const, ServiceHandle } from "../helper";
import { DEVICE, FONT_SIZE, PD, DIMENSION } from "../helper/Consts";
import { Images, ICON, FONT_SF } from "../assets";
import LinearGradient from "react-native-linear-gradient";
import AppImageCircle from "./AppImageCircle";
import { Icon, Spinner } from "native-base";
import AppText from "./AppText";
import ImagePicker from "react-native-image-picker";
import { AppImage } from "../components";
import RNFetchBlob from "rn-fetch-blob";
import { isIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";
import { Grayscale } from "react-native-color-matrix-image-filters";
import ImageResizer from "react-native-image-resizer";
import uuid from "uuid";

const _ = require("lodash");
class HeaderIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    // const HeaderIcon = (
    //     props = {
    //         // container
    //         bgSource,
    //         containerStyle,

    //         // header
    //         title,
    //         style,
    //         lIconColor,
    //         onBackPress,
    //         renderRight,
    //         lIconName,
    //         lIconStyle,

    //         // AppImageCircle
    //         iconSource,
    //         checked,
    //         iconName,
    //         styleImage,
    //         resizeMode,
    //         iconType,
    //         square,
    //         imagePicker,
    //         onUploadSuccess
    //     }
    // ) => {
    render() {
        let {
            // container
            bgSource = Images.IMAGE_TEST,
            containerStyle = {},
            resizeModeContainer = "cover",
            // header
            title = "",
            style = {},
            lIconColor = null,
            onBackPress = () => {},
            rightButton = false,
            renderRight = null,
            rIconName = "",
            rIconStyle = {},
            onRightPress = () => {},

            // AppImageCircle
            iconSource,
            image,
            checked,
            iconName,
            styleImage,
            resizeMode,
            iconType,
            square,
            imagePicker
        } = this.props;
        return (
            <Grayscale>
                <ImageBackground
                    {...this.props}
                    resizeMode={resizeModeContainer}
                    source={bgSource}
                    style={[styles.container, containerStyle]}
                >
                    <LinearGradient colors={Colors.GRADIENTBLACK} style={styles.gradient} />
                    <Header
                        title={title}
                        style={style}
                        lIconColor={lIconColor}
                        onBackPress={() => onBackPress()}
                        renderRight={renderRight}
                        rIconName={rIconName}
                        rIconStyle={rIconStyle}
                        onRightPress={() => onRightPress()}
                        rightButton={rightButton}
                    />
                    <View style={styles.imageWrap}>
                        <AppImageCircle
                            outterCStyle={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                            middleCStyle={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                            image={image}
                            source={iconSource}
                            // resizeMode="cover"
                            checked={checked}
                            iconName={iconName}
                            styleImage={[square ? styles.image : null, styleImage]}
                            resizeMode={resizeMode}
                            iconType={iconType}
                        />
                        {this.state.loading ? (
                            <View style={styles.spinnerWrap}>
                                <Spinner color={Colors.WHITE_COLOR} size="small" />
                            </View>
                        ) : null}
                    </View>
                    <View style={styles.view} />
                    {imagePicker && !this.state.loading ? (
                        <View style={styles.imagePicker}>
                            <TouchableOpacity onPress={() => this.handleChoosePhoto()} style={{ padding: 10 }}>
                                <AppImage local source={ICON.CAMERA} style={[styles.iconImagePicker]} />
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </ImageBackground>
            </Grayscale>
        );
    }

    async handleChoosePhoto() {
        let { onPickImage = () => {} } = this.props;
        const options = {
            title: "Select Avatar",
            storageOptions: {
                skipBackup: true,
                path: "images"
            }
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.data) {
                onPickImage(response.uri, true);
                this.setState({ loading: true }, () => {
                    // const fileUP = new FormData();
                    // fileUP.append({ name: "file", filename: "vid.mp4", data: RNFetchBlob.wrap(response.uri) });
                    // const blob = await new Promise((resolve, reject) => {
                    //     const xhr = new XMLHttpRequest();
                    //     xhr.onload = () => {
                    //         resolve(xhr.response);
                    //     };
                    //     xhr.onerror = e => {
                    //         reject(new TypeError("Network request failed"));
                    //     };
                    //     xhr.responseType = "blob";
                    //     xhr.open("GET", response.uri, true);
                    //     xhr.send(null);
                    // });
                    // this.uploadImageToFireBase(blob, response);
                    let id = uuid.v4();

                    if (response.fileSize > 1500000) {
                        this.compressImage(response, id);
                    } else {
                        this.toBlob(response, id);
                    }
                });
            }
        });
    }

    compressImage(result, id) {
        const size = 1200;

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
            this.toBlob(response, id);
        });
    }

    async toBlob(response, id) {
        let { onUploadSuccess = () => {}, sendImageError = () => {} } = this.props;

        // ANOTHER
        // code a Hai

        const fileUP1 = new FormData();
        fileUP1.append("file", {
            uri: response.uri,
            type: "image/png",
            name: `${id}.png`
        });
        const responseNew = await ServiceHandle.uploadImage(fileUP1);
        if (_.isEmpty(responseNew)) {
            sendImageError(id);
        } else {
            let url = `${Const.HOST_IMAGE}${responseNew.file}`;
            onUploadSuccess(url, false);
            this.setState({ loading: false });
        }
    }

    // uploadImageToFireBase(file, data) {
    //     let { onUploadSuccess = () => {} } = this.props;
    //     let fileName = `avatar/${data.fileName}`;
    //     var metadata = {
    //         contentType: "image/jpeg"
    //     };
    //     const self = this;
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
    //                     onUploadSuccess(url, false);
    //                     self.setState({ loading: false });
    //                 });
    //         });
    // }
}

const Header = (props = { title, style, lIconColor, onBackPress, rightButton }) => {
    let {
        title = "",
        style = {},
        lIconColor = "",
        onBackPress = () => {},
        renderRight = () => {},
        onRightPress = () => {},
        lIconName = "md-arrow-back",
        lIconStyle = {},
        rightButton = false
    } = props;
    return (
        <View style={styles.header}>
            <View style={styles.leftWrap}>
                <TouchableOpacity onPress={() => onBackPress()}>
                    <Icon
                        name="md-arrow-back"
                        style={[styles.icon]}
                        color={lIconColor ? lIconColor : Colors.WHITE_COLOR}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.centerWrap}>
                <AppText text={title} style={[styles.title, style]} />
            </View>
            <View style={styles.rightWrap}>
                {rightButton ? (
                    <TouchableOpacity onPress={() => onRightPress()} style={{ padding: 20 }}>
                        {renderRight ? (
                            renderRight()
                        ) : (
                            <Icon
                                name={lIconName}
                                style={[styles.icon, lIconStyle]}
                                color={lIconColor ? lIconColor : Colors.WHITE_COLOR}
                            />
                        )}
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

const H1 = DIMENSION.H1;
const H2 = DIMENSION.H2;
const H3 = DIMENSION.H3;

const HEADER_HEIGHT = DEVICE.DEVICE_HEIGHT * 0.27;
const MARGIN = H1 * 0.42;
const styles = {
    container: {
        height: HEADER_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        marginBottom: MARGIN
    },

    // Gradient
    gradient: {
        height: HEADER_HEIGHT,
        backgroundColor: "transparent",
        position: "absolute",
        opacity: 0.7,
        zIndex: 1,
        width: DEVICE.DEVICE_WIDTH
    },
    imageWrap: {
        position: "absolute",
        bottom: -MARGIN,
        zIndex: 3,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    view: {
        position: "absolute",
        top: HEADER_HEIGHT,
        zIndex: 2,
        width: "100%",
        height: MARGIN,
        backgroundColor: Colors.SKY_BLUE
    },

    // header
    header: {
        marginTop: getStatusBarHeight(isIphoneX()),
        width: DEVICE.DEVICE_WIDTH,
        height: 50,
        paddingHorizontal: PD.PADDING_3,
        flexDirection: "row",
        zIndex: 2
    },
    leftWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    centerWrap: {
        flex: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    rightWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: FONT_SIZE.HEADER,
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.BOLD
    },
    icon: {
        color: Colors.WHITE_COLOR,
        fontWeight: "bold"
    },
    image: {
        height: H3 - 8,
        width: H3 - 8,
        borderRadius: 0
    },
    imagePicker: {
        flex: 1,
        zIndex: 4,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: Const.PD.PADDING_2
    },
    iconImagePicker: {
        height: 18,
        width: 22
    },
    spinnerWrap: {
        position: "absolute",
        zIndex: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        height: DIMENSION.H3 - 8,
        width: DIMENSION.H3 - 8,
        borderRadius: (DIMENSION.H3 - 8) / 2,
        justifyContent: "center"
    }
};

export default HeaderIcon;
