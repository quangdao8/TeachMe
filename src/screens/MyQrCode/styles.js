import { Colors } from "helper";
import { DIMENSION, PD, DEVICE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";

const STATUS_BAR_HEIGHT = DIMENSION.STATUS_BAR_HEIGHT;
const HEADER_HEIGHT = DIMENSION.HEADER_HEIGHT;

export default {
    container: {
        height: DEVICE.DEVICE_HEIGHT,
        backgroundColor: Colors.SKY_BLUE,
        zIndex: -2,
        top: 0,
        alignItems: "center",
        position: "absolute",
        justifyContent: "center",
        width: DEVICE.DEVICE_WIDTH,
        paddingTop: 1,
        paddingLeft: 1
    },
    textQR: {
        color: Colors.BLACK_TEXT_COLOR,
        fontSize: responsiveFontSize(3),
        fontFamily: FONT_SF.SEMIBOLD
    },
    desWrap: {
        margin: PD.PADDING_4
    },
    desText: {
        color: Colors.BLACK_TEXT_COLOR,
        fontSize: responsiveFontSize(2),
        textAlign: "center"
    },
    background: {
        zIndex: -2,
        position: "absolute",
        height: DEVICE.DEVICE_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        top: 0
    },
    vertical: {
        height: DEVICE.DEVICE_HEIGHT / 2 - DEVICE.DEVICE_WIDTH * 0.35 + 0.5,
        width: "100%",
        backgroundColor: Colors.SKY_BLUE
    },
    horizontal: {
        height: DEVICE.DEVICE_WIDTH * 0.7 - 1,
        width: DEVICE.DEVICE_WIDTH * 0.15 + 0.5,
        backgroundColor: Colors.SKY_BLUE
    }
};
