import React from "react";
import { View, ImageBackground, TouchableOpacity, StatusBar } from "react-native";
import { Images, FONT_SF } from "../assets";
import { DEVICE, PD, FONT_SIZE } from "../helper/Consts";
import LinearGradient from "react-native-linear-gradient";
import { Icon } from "native-base";
import { Colors } from "../helper";
import { AppText, AppImageCircle, Button, IconImage } from "../components";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Grayscale } from "react-native-color-matrix-image-filters";

const HeaderImage = (
    props = {
        oneButton,
        twoButton,
        threeButton,

        // ImageBackground
        bgSource,
        containerStyle,

        // Header
        title,
        style,
        lIconColor,
        onBackPress,
        right,
        BtnRPress,

        // Avatar
        avatarSource,
        onLBtnPress,
        onRBtnPress,
        renderLeftbtn,
        renderRightbtn,
        avataStyle,
        disabledR,
        disabledL,

        // Info
        name,
        nameStyle,
        description,
        desStyle,
        infoContent,
        infoStyle,

        // THREEBTN
        titleLBtn,
        titleCBtn,
        titleRBtn,
        IconLBtnRender,
        IconCBtnRender,
        IconRBtnRender,
        leftBtnStyle,
        centerBtnStyle,
        rightBtnStyle,
        LBtmPress,
        CBtmPress,
        RBtmPress,
        disabledC,
        disabledLBtm,
        disabledRBtm,
        // TwoButton
        lBtntitle,
        leftBtmPress,
        lBtnStyle,
        lTBtnStyle,
        lIconBtnRender,
        rBtntitle,
        rightBtmPress,
        rBtnStyle,
        rTBtnStyle,
        rIconBtnRender,

        // OneButton
        cBtntitle,
        cTBtnStyle,
        cIconBtnRender,
        cBtnStyle,
        centerBtmPress,

        gradientStyle
    }
) => {
    let {
        oneButton = false,
        twoButton = false,
        threeButton = false,
        // ImageBackground
        bgSource = Images.IMAGE_TEST,
        containerStyle = {},

        // Header
        title = "",
        style = {},
        lIconColor = "",
        onBackPress = () => {},
        right,
        BtnRPress = () => {},

        // Avatar
        avatarSource = Images.IMAGE_TEST,
        onLBtnPress = () => {},
        onRBtnPress = () => {},
        renderLeftbtn = null,
        renderRightbtn = null,
        avataStyle = {},
        disabledR = false,
        disabledL = false,

        // Info
        name = "",
        nameStyle = {},
        description = "",
        desStyle = {},
        infoContent = null,
        infoStyle = {},

        //threeBTN
        titleLBtn = "",
        titleCBtn = "",
        titleRBtn = "",
        IconLBtnRender = null,
        IconCBtnRender = null,
        IconRBtnRender = null,
        leftBtnStyle = {},
        centerBtnStyle = {},
        rightBtnStyle = {},
        LBtmPress = () => {},
        CBtmPress = () => {},
        RBtmPress = () => {},
        disabledC = false,
        disabledLBtm = false,
        disabledRBtm = false,
        // TwoButton
        lBtntitle = "",
        leftBtmPress = () => {},
        lBtnStyle = {},
        lTBtnStyle = {},
        lIconBtnRender = null,
        rBtntitle = "",
        rightBtmPress = () => {},
        rBtnStyle = {},
        rTBtnStyle = {},
        rIconBtnRender = null,

        // OneButton
        cBtntitle = "",
        cTBtnStyle = {},
        cIconBtnRender = null,
        cBtnStyle = {},
        centerBtmPress = () => {},

        gradientStyle = {}
    } = props;
    return (
        <Grayscale>
            <ImageBackground source={bgSource} style={[styles.container, containerStyle]}>
                <StatusBar backgroundColor={Colors.STATUSBAR} barStyle="light-content" translucent={true} />
                <LinearGradient colors={Colors.GRADIENTBLACK} style={[styles.gradient, gradientStyle]} />
                <Header
                    title={title}
                    style={style}
                    lIconColor={lIconColor}
                    onBackPress={() => onBackPress()}
                    right={right}
                    BtnRPress={() => BtnRPress()}
                />
                <Avatar
                    avatarSource={avatarSource}
                    onLBtnPress={() => onLBtnPress()}
                    onRBtnPress={() => onRBtnPress()}
                    renderLeftbtn={renderLeftbtn}
                    renderRightbtn={renderRightbtn}
                    disabledL={disabledL}
                    disabledR={disabledR}
                    avataStyle={avataStyle}
                />
                <Info
                    name={name}
                    nameStyle={nameStyle}
                    desStyle={desStyle}
                    description={description}
                    content={infoContent}
                    infoStyle={infoStyle}
                />
                {oneButton ? (
                    <OneButton
                        cBtntitle={cBtntitle}
                        cTBtnStyle={cTBtnStyle}
                        cIconBtnRender={cIconBtnRender}
                        cBtnStyle={cBtnStyle}
                        centerBtmPress={() => centerBtmPress()}
                    />
                ) : null}
                {twoButton ? (
                    <TwoButton
                        lBtnStyle={lBtnStyle}
                        lTBtnStyle={lTBtnStyle}
                        lIconBtnRender={lIconBtnRender}
                        lBtntitle={lBtntitle}
                        leftBtmPress={() => leftBtmPress()}
                        rBtntitle={rBtntitle}
                        rightBtmPress={() => rightBtmPress()}
                        rBtnStyle={rBtnStyle}
                        rTBtnStyle={rTBtnStyle}
                        rIconBtnRender={rIconBtnRender}
                    />
                ) : null}

                {threeButton ? (
                    <ThreeButton
                        titleLBtn={titleLBtn}
                        titleCBtn={titleCBtn}
                        titleRBtn={titleRBtn}
                        IconLBtnRender={IconLBtnRender}
                        IconCBtnRender={IconCBtnRender}
                        IconRBtnRender={IconRBtnRender}
                        leftBtnStyle={leftBtnStyle}
                        centerBtnStyle={centerBtnStyle}
                        rightBtnStyle={rightBtnStyle}
                        LBtmPress={() => LBtmPress()}
                        CBtmPress={() => CBtmPress()}
                        RBtmPress={() => RBtmPress()}
                        disabledC={disabledC}
                        disabledLBtm={disabledLBtm}
                        disabledRBtm={disabledRBtm}
                    />
                ) : null}
            </ImageBackground>
        </Grayscale>
    );
};

const Header = (props = { title, style, lIconColor, onBackPress, right, BtnRPress }) => {
    let { title = "", style = {}, lIconColor = "", onBackPress = () => {}, right, BtnRPress = () => {} } = props;
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.leftWrap} onPress={() => onBackPress()}>
                <Icon name="md-arrow-back" style={[styles.icon]} color={lIconColor ? lIconColor : Colors.WHITE_COLOR} />
            </TouchableOpacity>
            <View style={styles.centerWrap}>
                <AppText text={title} style={[styles.title, style]} />
            </View>
            {right ? (
                <TouchableOpacity style={styles.rightWrap} onPress={() => BtnRPress()}>
                    <Icon
                        name="trash"
                        type="EvilIcons"
                        style={[styles.icon]}
                        color={lIconColor ? lIconColor : Colors.WHITE_COLOR}
                    />
                </TouchableOpacity>
            ) : (
                <View style={styles.rightWrap} />
            )}
        </View>
    );
};

const Avatar = (
    props = {
        avatarSource,
        hasLeftBtn,
        hasRightBtn,
        onLBtnPress,
        onRBtnPress,
        renderLeftbtn,
        avataStyle,
        disabledL,
        disabledR
    }
) => {
    let {
        avatarSource,
        onLBtnPress = () => {},
        onRBtnPress = () => {},
        renderLeftbtn = "",
        renderRightbtn = "",
        avataStyle = {},
        disabledL,
        disabledR
    } = props;
    return (
        <View style={[styles.avatarWrap, avataStyle]}>
            <View style={styles.lIconWrap}>
                {renderLeftbtn ? (
                    <TouchableOpacity disabled={disabledL} onPress={() => onLBtnPress()}>
                        {renderLeftbtn}
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={{ flex: 1 }}>
                <AppImageCircle source={avatarSource} image resizeMode="cover" />
            </View>
            <View style={styles.rIconWrap}>
                {renderRightbtn ? (
                    <TouchableOpacity disabled={disabledR} onPress={() => onRBtnPress()}>
                        {renderRightbtn}
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

const Info = (props = { name, style, description, content, infoStyle }) => {
    let { name = "", nameStyle = {}, desStyle = {}, description = "", content = null, infoStyle = {} } = props;
    return (
        <View style={[styles.nameWrap, infoStyle]}>
            {name ? <AppText text={name} style={[styles.name, nameStyle]} /> : null}
            {description ? <AppText text={description} style={[styles.desciption, desStyle]} /> : null}
            {content}
        </View>
    );
};

const ThreeButton = (
    props = {
        titleLBtn,
        titleCBtn,
        titleRBtn,
        IconLBtnRender,
        IconCBtnRender,
        IconRBtnRender,
        leftBtnStyle,
        centerBtnStyle,
        rightBtnStyle,
        LBtmPress,
        CBtmPress,
        RBtmPress,
        disabledC,
        disabledLBtm,
        disabledRBtm
    }
) => {
    let {
        titleLBtn = "",
        titleCBtn = "",
        titleRBtn = "",
        IconLBtnRender = "",
        IconCBtnRender = "",
        IconRBtnRender = "",
        leftBtnStyle = {},
        centerBtnStyle = {},
        rightBtnStyle = {},
        LBtmPress = () => {},
        CBtmPress = () => {},
        RBtmPress = () => {},
        disabledC,
        disabledLBtm,
        disabledRBtm = () => {}
    } = props;
    return (
        <View style={styles.threeBtnContainer}>
            <Button
                disabled={disabledLBtm}
                title={titleLBtn}
                centerContent={IconLBtnRender}
                // tStyle={tLBtnStyle}
                onPress={() => LBtmPress()}
                // renderLeftIcon={IconLBtnRender}
                style={[styles.threeBtn, leftBtnStyle]}
            />
            <Button
                title={titleCBtn}
                centerContent={IconCBtnRender}
                // tStyle={tCBtnStyle}
                disabled={disabledC}
                onPress={() => CBtmPress()}
                // renderLeftIcon={IconCBtnRender}
                style={[styles.threeBtn, centerBtnStyle]}
            />
            <Button
                disabled={disabledRBtm}
                title={titleRBtn}
                centerContent={IconRBtnRender}
                // tStyle={tCBtnStyle}
                onPress={() => RBtmPress()}
                // renderLeftIcon={IconRBtnRender}
                style={[styles.threeBtn, rightBtnStyle]}
            />
        </View>
    );
};

const TwoButton = (
    props = {
        lBtntitle,
        leftBtmPress,
        rBtntitle,
        rightBtmPress,
        lBtnStyle,
        rBtnStyle,
        lTBtnStyle,
        rTBtnStyle,
        lIconBtnRender,
        rIconBtnRender
    }
) => {
    let {
        lBtntitle = "",
        leftBtmPress = () => {},
        rBtntitle = "",
        rightBtmPress = () => {},
        lBtnStyle = {},
        rBtnStyle = {},
        lTBtnStyle = {},
        rTBtnStyle = {},
        lIconBtnRender = "",
        rIconBtnRender = ""
    } = props;
    return (
        <View style={styles.twoBtnContainer}>
            <Button
                title={lBtntitle}
                tStyle={lTBtnStyle}
                onPress={() => leftBtmPress()}
                renderLeftIcon={lIconBtnRender}
                style={[styles.twoBtn, lBtnStyle]}
            />
            <Button
                title={rBtntitle}
                tStyle={rTBtnStyle}
                onPress={() => rightBtmPress()}
                renderLeftIcon={rIconBtnRender}
                style={[styles.twoBtn, rBtnStyle]}
            />
        </View>
    );
};

const OneButton = (props = { cBtntitle, cTBtnStyle, cIconBtnRender, cBtnStyle, centerBtmPress }) => {
    let { cBtntitle = "", cTBtnStyle = {}, cIconBtnRender = null, cBtnStyle, centerBtmPress = () => {} } = props;
    return (
        <View style={styles.oneBtnContainer}>
            <Button
                title={cBtntitle}
                tStyle={cTBtnStyle}
                onPress={() => centerBtmPress()}
                renderLeftIcon={cIconBtnRender}
                style={[styles.oneBtn, cBtnStyle]}
            />
        </View>
    );
};

const H1 = DEVICE.DEVICE_HEIGHT * 0.55;
const W2BTN = DEVICE.DEVICE_WIDTH * 0.4;
const W3BTN = DEVICE.DEVICE_WIDTH * 0.25;
const W1BTN = DEVICE.DEVICE_WIDTH * 0.7;
const HBTN = 50;

const styles = {
    // ImageBackground
    container: {
        height: H1,
        width: DEVICE.DEVICE_WIDTH,
        marginBottom: HBTN / 2
    },

    // Gradient
    gradient: {
        backgroundColor: "transparent",
        position: "absolute",
        opacity: 0.8,
        zIndex: 1,
        height: H1,
        width: DEVICE.DEVICE_WIDTH
    },

    // header
    header: {
        paddingTop: getStatusBarHeight(),
        width: DEVICE.DEVICE_WIDTH,
        height: getStatusBarHeight() + 55,
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
        // fontWeight: "bold"
    },
    icon: {
        color: Colors.WHITE_COLOR,
        fontWeight: "bold"
    },

    // Avatar
    avatarWrap: {
        // flex: 1,
        zIndex: 2,
        // marginTop: H1 / 20,
        width: DEVICE.DEVICE_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
        // backgroundColor:'red'
    },
    rIconWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    lIconWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    // name wrap
    nameWrap: {
        flex: 1,
        zIndex: 2,
        width: DEVICE.DEVICE_WIDTH,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: PD.PADDING_1
    },
    name: {
        fontSize: FONT_SIZE.TITLE,
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.BOLD
        // fontWeight: "bold"
    },
    desciption: {
        fontSize: FONT_SIZE.CONTENT_SIZE,
        color: Colors.WHITE_COLOR,
        opacity: 0.8
    },
    // 2 button
    twoBtnContainer: {
        position: "absolute",
        bottom: -HBTN / 2,
        width: DEVICE.DEVICE_WIDTH,
        flexDirection: "row",
        justifyContent: "space-evenly",
        zIndex: 2
    },
    threeBtnContainer: {
        position: "absolute",
        bottom: -HBTN / 2,
        width: DEVICE.DEVICE_WIDTH,
        flexDirection: "row",
        justifyContent: "space-evenly",
        zIndex: 2,
        paddingHorizontal: PD.PADDING_4
    },
    twoBtn: {
        width: W2BTN,
        height: HBTN
    },

    threeBtn: {
        width: W3BTN,
        height: HBTN,
        alignItems: "center",
        justifyContent: "center"
    },

    // OneButton
    oneBtnContainer: {
        position: "absolute",
        bottom: -HBTN / 2,
        width: DEVICE.DEVICE_WIDTH,
        flexDirection: "row",
        justifyContent: "space-evenly",
        zIndex: 2
    },
    oneBtn: {
        width: W1BTN,
        height: HBTN
    }
};

export default HeaderImage;
