import React from "react";
import { View, TouchableOpacity, Keyboard, StatusBar, Switch, ImageBackground, Platform } from "react-native";
import { Colors, Const } from "../helper";
import AppText from "./AppText";
import { Icon, Input } from "native-base";
import I18n from "../helper/locales";
import { AppImage } from "../components";
import { ICON, FONT_SF, Images } from "../assets";
import { FONT_SIZE, PD, DEVICE, DIMENSION } from "../helper/Consts";
import { DrawerActions } from "react-navigation";
import { connect } from "react-redux";
import { drawerActions } from "actions";

const hitSlop = {
    top: PD.PADDING_2,
    bottom: PD.PADDING_2,
    left: PD.PADDING_2,
    right: PD.PADDING_2
};
class HeaderApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: false,
            value: "",
            valueSwitch: true
        };
    }

    componentDidMount() {
        const { initSwitch } = this.props;
        this.setState({
            valueSwitch: initSwitch
        });
    }

    componentDidUpdate(prev) {
        const { changeTab, onChangeText = () => {}, rightOnPress = () => {} } = this.props;
        if (prev.isSearch !== this.props.isSearch) {
            // if (changeTab) {
            //     this.setState({ value: "" });
            // }
            if (!this.props.isSearch) {
                this.setState({ search: false, value: "" });
                onChangeText("");
                rightOnPress("");
            }
        }
    }

    // componentDidUpdate() {
    // }

    toggleDrawer() {
        Keyboard.dismiss();

        this.props.dispatch(drawerActions.openDrawer());
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
        const { isBack, leftOnPress, navigation, onChangeText = () => {}, rightOnPress = () => {} } = this.props;
        let { search } = this.state;
        Keyboard.dismiss();
        if (search) {
            this.setState({ search: false, value: "" });
            onChangeText("");
            rightOnPress("");
        } else {
            if (leftOnPress) {
                leftOnPress();
                return;
            }
            if (isBack) {
                navigation.goBack();
                return;
            }
        }
    }

    renderBack() {
        const { leftIcon, leftTitle, iconType = "Ionicons", isBack, iconLeftName = "md-arrow-back" } = this.props;
        let { search } = this.state;
        return (
            <TouchableOpacity onPress={() => this.onBackPress()} style={styles.leftChildContainer} hitSlop={hitSlop}>
                {leftIcon || isBack || search ? (
                    <View style={styles.iconHeader}>
                        {search ? (
                            <AppImage local source={ICON.BACK} style={styles.icon} resizeMode="contain" />
                        ) : (
                            // <Icon type={iconType} name={iconLeftName} size={25} style={{ color: Colors.WHITE_COLOR }} />
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
        let { isBack, leftIcon, isSearch, menu = true } = this.props;
        return (search && isSearch) || isBack || leftIcon ? (
            this.renderBack()
        ) : menu ? (
            this.renderMenu()
        ) : (
            <View style={styles.leftChildContainer} hitSlop={hitSlop} />
        );
    }

    renderMiddle() {
        const { title, titleStyle, isSearch } = this.props;
        let { search } = this.state;
        return (
            <View style={styles.titleContainer}>
                {!search && this.renderSwitch()}
                {search && isSearch ? (
                    this.renderSearch()
                ) : title ? (
                    <AppText text={title} style={[styles.title, titleStyle]} />
                ) : null}
            </View>
        );
    }

    onChangeText(e) {
        let { onChangeText = () => {} } = this.props;
        this.setState({ value: e });
        onChangeText(e);
    }

    renderSearch() {
        let { value } = this.state;
        return (
            <Input
                {...this.props}
                ref={ref => (this.input = ref)}
                value={value}
                onChangeText={e => this.onChangeText(e)}
                placeholder={I18n.t("header.search")}
                placeholderTextColor={"rgba(255,255,255,0.7)"}
                style={styles.input}
                onSubmitEditing={() => this.onPressRight()}
            />
        );
    }

    onPressRight() {
        const { rightOnPress = () => {}, isSearch, changeTab } = this.props;
        let { search, value } = this.state;
        Keyboard.dismiss();
        if (search) {
            // function input
            rightOnPress(value.trim());
            changeTab && this.input && this.input._root.focus();
        } else {
            // open input
            isSearch &&
                this.setState({ search: true }, () => {
                    this.input._root.focus();
                });
            rightOnPress();
        }
    }

    renderRightChild() {
        const {
            rightIcon,
            leftTitle,
            rIconType,
            isSearch,
            rightOnPress = () => {},
            rightIconName,
            rIconSize = 25,
            rIconStyle = {},
            changeTab = false,
            rightTitle
        } = this.props;
        return (
            <TouchableOpacity onPress={() => this.onPressRight()} style={styles.rightChildContainer} hitSlop={hitSlop}>
                {isSearch || changeTab ? (
                    <AppImage local source={ICON.MAGNIFY} style={styles.icon} resizeMode="contain" />
                ) : rightIcon ? (
                    <View style={styles.iconHeader}>
                        {rightTitle ? (
                            <AppText style={styles.txtRight} text={rightTitle} />
                        ) : (
                            <Icon
                                color={Colors.WHITE_COLOR}
                                style={[{ color: Colors.WHITE_COLOR }, rIconStyle]}
                                type={rIconType ? rIconType : "MaterialCommunityIcons"}
                                name={isSearch ? "magnify" : rightIconName}
                                size={rIconSize}
                            />
                        )}
                    </View>
                ) : null}

                {leftTitle ? <AppText text={leftTitle} /> : null}
            </TouchableOpacity>
        );
    }

    renderStatusBar() {
        const { statusBar = true } = this.props;
        return (
            statusBar && (
                <View style={styles.statusBar}>
                    <StatusBar translucent backgroundColor={Colors.STATUSBAR} barStyle="light-content" />
                </View>
            )
        );
    }

    renderSwitch() {
        let { isSwitch, onValueChange = () => {} } = this.props;
        let { valueSwitch } = this.state;
        return isSwitch ? (
            <View style={styles.switchButton}>
                <Switch
                    hitSlop={hitSlop}
                    style={styles.switch}
                    value={valueSwitch}
                    trackColor={{ true: Colors.GREEN_COLOR }}
                    onValueChange={valueSwitch => {
                        onValueChange(valueSwitch);
                        this.setState({ valueSwitch });
                    }}
                    thumbColor={Colors.WHITE_COLOR}
                />
            </View>
        ) : null;
    }

    // componentDidUpdate(prevProps) {
    //     let { closeSearch } = this.props;
    //     if (prevProps.closeSearch !== closeSearch) {
    //         if (closeSearch.closeSearch == "CLOSE_SEARCH") {
    //             this.setState({ search: false, value: "" });
    //         }
    //     }
    // }

    render() {
        const { headerContainer, transparent = false } = this.props;
        return transparent ? (
            <View
                // source={Images.HEADER_BG}
                // resizeMode="cover"
                style={[styles.headerContainer, headerContainer]}
            >
                {/* {this.renderStatusBar()} */}
                {this.renderLeftChild()}
                {this.renderMiddle()}
                {/* {this.renderSwitch()} */}
                {this.renderRightChild()}
            </View>
        ) : (
            <View
                // source={Images.HEADER_BG}
                // resizeMode="cover"
                style={[styles.headerContainer, headerContainer]}
            >
                {this.renderStatusBar()}
                {this.renderLeftChild()}
                {this.renderMiddle()}
                {/* {this.renderSwitch()} */}
                {this.renderRightChild()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        // userReducer: state.userReducer
    };
}
HeaderApp = connect(mapStateToProps)(HeaderApp);
export default HeaderApp;

const STATUS_BAR_HEIGHT = DIMENSION.STATUS_BAR_HEIGHT;
const HEADER_HEIGHT = DIMENSION.HEADER_HEIGHT;

const styles = {
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: STATUS_BAR_HEIGHT + HEADER_HEIGHT,
        // height: 55,
        // width: "100%",
        backgroundColor: Colors.MAIN_COLOR,
        // backgroundColor: "#00a7e5",
        // backgroundColor: "transparent",
        paddingTop: STATUS_BAR_HEIGHT
    },
    leftTitle: {
        textAlign: "center",
        fontSize: Const.FONT_SIZE.HEADER,
        color: Colors.WHITE_COLOR
    },
    titleContainer: {
        flex: 6,
        justifyContent: "center",
        alignItems: "center"
        // backgroundColor: "#00a7e5"
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
        // backgroundColor: "#00a7e5"
    },
    rightChildContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        flexDirection: "row"
        // backgroundColor: "#00a7e5"
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
        height: DIMENSION.STATUS_BAR_HEIGHT
    },
    switchButton: {
        position: "absolute",
        right: 0
        // top: 0
        // zIndex: 3
        // paddingTop: STATUS_BAR_HEIGHT,
        // right: 36
    },
    switch: {
        transform: Platform.OS == "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [{ scaleX: 1 }, { scaleY: 1 }]
    },
    txtRight: {
        color: Colors.WHITE_COLOR,
        fontSize: FONT_SIZE.INPUT,
        fontWeight: "bold"
    }
};
