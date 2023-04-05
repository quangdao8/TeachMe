import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper/index";
import { Images, FONT_SF, ICON } from "assets";
import { PD, FONT_SIZE, DEVICE } from "helper/Consts";
import FastImage from "react-native-fast-image";

const HEIGHT = DEVICE.DEVICE_HEIGHT * 0.13;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 8;
const FAB_HEIGHT = DEVICE.DEVICE_WIDTH * 0.17;
const FAB_RADIUS = FAB_HEIGHT / 2;

const styles = {
    btnTabs: {
        height: 40,
        width: "50%",
        backgroundColor: Colors.MAIN_COLOR,
        alignSelf: "center",
        flexDirection: "row",
        marginVertical: PD.PADDING_3,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.MAIN_COLOR
    },
    btnContact: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    btnLike: {
        flex: 1,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        // backgroundColor: "red"
        backgroundColor: "#dff5fd"
    },
    content: {
        marginLeft: PD.PADDING_4,
        flexDirection: "row"
    },
    imageOutLine: {
        height: OUTLINE_SIZE,
        width: OUTLINE_SIZE,
        borderRadius: WIDTH_M * 0.09,
        padding: 8,
        backgroundColor: "rgba(255,255,255,0.5)",
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2
    },

    groupName: {
        fontSize: responsiveFontSize(2.3),
        fontFamily: FONT_SF.MEDIUM,
        color: Colors.BLACK_TEXT_COLOR
    },

    groupMessage: {
        fontSize: responsiveFontSize(2),
        fontFamily: FONT_SF.REGULAR,
        color: "#999999"
    },
    leftContent: {
        width: WIDTH_M * 0.2,
        justifyContent: "center",
        lignItems: "flex-start",
        height: HEIGHT
    },
    centerContent: {
        width: WIDTH_M * 0.7,
        height: HEIGHT,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: Colors.WHITE_COLOR,
        flexDirection: "row",
        alignItems: "center"
    },
    rightContent: {
        width: WIDTH_M * 0.15,
        height: HEIGHT,
        alignItems: "center",
        justifyContent: "center"
    },

    badget: {
        backgroundColor: Colors.MAIN_COLOR,
        height: 25,
        width: 25,
        borderRadius: 12.5,
        alignItems: "center",
        justifyContent: "center"
    },
    timeWrap: {
        height: HEIGHT * 0.3,
        justifyContent: "flex-end",
        alignItems: "flex-start"
    },
    time: {
        fontSize: responsiveFontSize(1.8),
        color: Colors.MAIN_COLOR
    },
    badgetWrap: {
        height: HEIGHT * 0.6,
        justifyContent: "center",
        alignItems: "center"
    },
    badgetText: {
        color: Colors.WHITE_COLOR
    },
    onlineDotOutline: {
        padding: 4,
        position: "absolute",
        height: 16,
        width: 16,
        borderRadius: 9,
        bottom: 0,
        right: AVATAR_SIZE * 0.1,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },
    offlineDotOutline: {
        padding: 4,
        position: "absolute",
        height: 16,
        width: 16,
        borderRadius: 9,
        bottom: 0,
        right: AVATAR_SIZE * 0.1,
        zIndex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },
    icApp: {
        width: 25,
        height: 35,

        marginRight: 10
    },
    containerCharacter: {
        position: "absolute",
        width: 20,
        right: 5,
        zIndex: 1
    },
    fabActive: {
        backgroundColor: "#EA098D",
        width: FAB_HEIGHT,
        height: FAB_HEIGHT,
        borderRadius: FAB_RADIUS
    },
    fabInactive: {
        backgroundColor: "#0AB4D8",
        width: FAB_HEIGHT,
        height: FAB_HEIGHT,
        borderRadius: FAB_RADIUS
    },
    textEmpty: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: "600",
        textAlign: "center",
        color: Colors.MAIN_COLOR,
        marginTop: PD.PADDING_4
    }
};
export default styles;
