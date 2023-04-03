import { DIMENSION, PD, DEVICE } from "helper/Consts";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";

export default {
    inputWrap: {
        height: DIMENSION.INPUT_HEIGHT,
        justifyContent: "center",
        paddingHorizontal: PD.PADDING_4,
        backgroundColor: Colors.WHITE_COLOR
    },
    inputGroupName: {
        fontFamily: FONT_SF.REGULAR,
        color: "#000",
        fontSize: responsiveFontSize(2)
    },
    container: {
        backgroundColor: Colors.SKY_BLUE,
        flex: 1
    },
    searchWrap: {
        height: DIMENSION.INPUT_HEIGHT * 0.85,
        margin: PD.PADDING_4,
        paddingHorizontal: PD.PADDING_4,
        backgroundColor: Colors.WHITE_COLOR,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.DIABLED_BUTTON,
        borderRadius: DIMENSION.INPUT_RADIUS * 0.8
    },
    searchInput: {
        width: "90%",
        height: DIMENSION.INPUT_HEIGHT * 1.1,
        // backgroundColor: Colors.SKY_BLUE,
        paddingHorizontal: PD.PADDING_4,
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR,
        fontSize: responsiveFontSize(2)
    },
    spinerWrap: {
        position: "absolute",
        top: 0,
        left: 0,
        height: DEVICE.DEVICE_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 3,
        justifyContent: "center"
    }
};
