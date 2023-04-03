import React from "react";
import { View, TouchableOpacity, Keyboard, StatusBar, Platform, ImageBackground } from "react-native";
import { Colors, Const } from "../helper";
import AppText from "./AppText";
import { Icon, Input } from "native-base";
import I18n from "../helper/locales";
import { AppImage } from "../components";
import { ICON, Images, FONT_SF } from "../assets";
import { FONT_SIZE, PD, DEVICE, DIMENSION } from "../helper/Consts";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import FastImage from "react-native-fast-image";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Col, Row, Grid } from "react-native-easy-grid";

const STATUS_BAR_HEIGHT = DIMENSION.STATUS_BAR_HEIGHT;
const HEADER_HEIGHT = DIMENSION.HEADER_HEIGHT;
const _ = require("lodash");
const hitSlop = {
    top: PD.PADDING_2,
    bottom: PD.PADDING_2,
    left: PD.PADDING_2,
    right: PD.PADDING_2
};
export default class HeaderChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: false,
            value: ""
        };
    }

    toggleDrawer() {
        Keyboard.dismiss();
        // this.props.dispatch(DrawerActions.toggleDrawer());
        // this.props.navigation.toggleDrawer();
    }

    renderMenu() {
        const { iconTypeMenu = "Ionicons", iconMenuName = "menu" } = this.props;

        return (
            <TouchableOpacity onPress={() => this.toggleDrawer()} style={styles.leftChildContainer}>
                <View style={styles.iconHeader}>
                    <Icon type={iconTypeMenu} name={iconMenuName} size={25} style={{ color: Colors.WHITE_COLOR }} />
                </View>
            </TouchableOpacity>
        );
    }

    onBackPress() {
        const { isBack, leftOnPress, navigation } = this.props;
        let { search } = this.state;
        Keyboard.dismiss();
        if (search) {
            this.setState({ search: false, value: "" });
        } else {
            if (leftOnPress) {
                leftOnPress();
                return;
            }
        }
        if (isBack) {
            navigation.goBack();
            return;
        }
    }

    renderBack() {
        const { leftIcon, leftTitle, iconType = "Ionicons", isBack, iconLeftName = "md-arrow-back" } = this.props;
        let { search } = this.state;
        return (
            <TouchableOpacity onPress={() => this.onBackPress()} style={styles.leftChildContainer} hitSlop={hitSlop}>
                {leftIcon || isBack ? (
                    <View style={styles.iconHeader}>
                        {search ? (
                            <AppImage local source={ICON.BACK} style={styles.icon} resizeMode="contain" />
                        ) : (
                            <AppImage local source={ICON.BACK} style={styles.icon} resizeMode="contain" />
                        )}
                    </View>
                ) : null}
                {leftTitle ? <AppText text={leftTitle} /> : null}
            </TouchableOpacity>
        );
    }

    renderLeftChild() {
        let { search } = this.state;
        let { isBack, leftIcon } = this.props;
        return search || isBack || leftIcon ? this.renderBack() : this.renderMenu();
    }

    renderMiddle() {
        const { source = "", name = "", status = " ", disableTitle = false, onPressTitle = () => {} } = this.props;
        let { search } = this.state;
        let avatar = _.isEmpty(source) ? Images.DEFAULT_AVATAR : { uri: source };

        return (
            <TouchableOpacity disabled={disableTitle} onPress={() => onPressTitle()} style={styles.titleContainer}>
                <View style={styles.imageAvatarWrap}>
                    {_.isArray(source) ? (
                        <View style={{ alignItems: "center" }}>
                            <View
                                style={[
                                    {
                                        position: "absolute",
                                        zIndex: 5,
                                        borderWidth: 2,
                                        borderColor: "#F1F1F1",
                                        borderRadius: 20,
                                        height: "100%",
                                        width: "100%"
                                    }
                                ]}
                            />

                            <Grid style={styles.grid}>
                                <Col>
                                    <View style={styles.imageGridView}>
                                        <AppImage
                                            source={{ uri: source[0] }}
                                            style={styles.imageGrid}
                                            resizeMode="cover"
                                        />
                                    </View>
                                </Col>
                                <Col>
                                    <Row>
                                        <View style={styles.imageGridView}>
                                            <AppImage
                                                source={{ uri: source[1] }}
                                                style={styles.imageGrid}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </Row>
                                    <Row>
                                        <View style={styles.imageGridView}>
                                            <AppImage
                                                source={{ uri: source[2] }}
                                                style={styles.imageGrid}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </Row>
                                </Col>
                            </Grid>
                        </View>
                    ) : (
                        <AppImage
                            resizeMode="cover"
                            source={avatar}
                            style={{ height: 35, width: 35, borderRadius: 17.5, overflow: "hidden" }}
                        />
                    )}
                </View>
                <View style={styles.textWrap}>
                    <AppText text={name} style={styles.name} numberOfLines={1} />
                    <AppText text={status} style={styles.status} />
                </View>
            </TouchableOpacity>
        );
    }

    renderRightChild() {
        const {
            rightOnFirstPress = () => {},
            rightFirstIcon = ICON.CHAT_PHONE,
            rightOnSecondPress = () => {},
            rightSecondIcon = ICON.CHAT_VIDEO_CALL,
            disableRight = false
        } = this.props;
        return (
            <View style={[styles.rightChildContainer]}>
                {!disableRight && (
                    <TouchableOpacity onPress={() => rightOnFirstPress()} hitSlop={hitSlop}>
                        <AppImage local source={rightFirstIcon} style={styles.iconRight} resizeMode="contain" />
                    </TouchableOpacity>
                )}
                {!disableRight && (
                    <TouchableOpacity onPress={() => rightOnSecondPress()} hitSlop={hitSlop}>
                        <AppImage local source={rightSecondIcon} style={styles.iconRight} resizeMode="contain" />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    renderStatusBar() {
        return (
            <View style={styles.statusBar}>
                <StatusBar translucent backgroundColor={Colors.STATUSBAR} barStyle="light-content" />
            </View>
        );
    }

    render() {
        const { headerContainer } = this.props;
        return (
            <View style={[styles.headerContainer, headerContainer]}>
                {this.renderStatusBar()}
                {this.renderLeftChild()}
                {this.renderMiddle()}
                {this.renderRightChild()}
            </View>
            // </View>
        );
    }
}

const styles = {
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: STATUS_BAR_HEIGHT + HEADER_HEIGHT,
        backgroundColor: Colors.MAIN_COLOR,
        paddingTop: STATUS_BAR_HEIGHT
    },
    leftTitle: {
        textAlign: "center",
        fontSize: Const.FONT_SIZE.HEADER,
        color: Colors.WHITE_COLOR
    },
    titleContainer: {
        flex: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: PD.PADDING_3
    },
    title: {
        textAlign: "center",
        // marginTop: 5,
        fontSize: Const.FONT_SIZE.HEADER,
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.BOLD
        // fontWeight: "bold"
    },
    leftChildContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        flexDirection: "row",
        flex: 1
    },
    rightChildContainer: {
        flex: 1.5,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "transparent",
        flexDirection: "row",
        paddingRight: 4
    },
    iconHeader: {
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        width: "100%",
        color: Colors.WHITE_COLOR,
        fontSize: FONT_SIZE.INPUT
    },
    icon: {
        height: 20,
        width: 20
    },
    statusBar: {
        position: "absolute",
        top: 0,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: Colors.STATUSBAR,
        height: STATUS_BAR_HEIGHT
    },
    imageAvatarWrap: {
        height: 40,
        width: 40,
        borderRadius: 20,
        // padding: 5,
        backgroundColor: "rgba(255,255,255,0.5)",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    textWrap: {
        height: HEADER_HEIGHT,
        marginLeft: PD.PADDING_4,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: "space-evenly",
        flex: 1
        // backgroundColor: "green"
    },
    name: {
        fontSize: responsiveFontSize(2.5),
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.MEDIUM
        // lineHeight: responsiveFontSize(3)
    },
    status: {
        fontSize: responsiveFontSize(1.9),
        color: Colors.WHITE_COLOR
        // lineHeight: responsiveFontSize(1.9)
    },
    iconRight: {
        height: 23,
        width: 23
        // marginRight: 4,
    },
    grid: {
        height: "100%",
        width: "100%",
        padding: 1
    },
    imageGridView: {
        flex: 1,
        backgroundColor: "white",
        padding: PD.PADDING_1 / 10
    },
    imageGrid: {
        height: "100%",
        width: "100%"
    }
};
