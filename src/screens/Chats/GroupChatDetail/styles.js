import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import { PD, DIMENSION, DEVICE } from "helper/Consts";
import { FONT_SF } from "assets";

export default {
    container: {
        flex: 1,
        backgroundColor: Colors.SKY_BLUE
    },
    emptyText: {
        fontSize: responsiveFontSize(2.5),
        color: Colors.MAIN_COLOR,
        textAlign: "center"
    },
    emptySuggest: {
        fontSize: responsiveFontSize(2),
        color: Colors.MAIN_COLOR,
        textAlign: "center"
    },
    containerEmpty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: PD.PADDING_4
    },
    inputContainer: {
        backgroundColor: Colors.WHITE_COLOR,
        paddingHorizontal: PD.PADDING_4,
        borderRadius: DIMENSION.INPUT_RADIUS
    },
    inputWrap: {
        width: "100%",
        flex: 1
    },
    input: {
        height: DIMENSION.INPUT_HEIGHT,
        fontFamily: FONT_SF.REGULAR,
        width: "100%",
        fontSize: responsiveFontSize(2),
        color: Colors.BLACK_TEXT_COLOR,
        borderRadius: DIMENSION.INPUT_RADIUS
    },
    title: {
        fontFamily: FONT_SF.BOLD,
        fontSize: responsiveFontSize(2.5),
        paddingBottom: PD.PADDING_1,
        paddingTop: PD.PADDING_4
    },
    wrapInner: {
        paddingHorizontal: PD.PADDING_4
    },
    iconStyle: {
        fontSize: responsiveFontSize(6)
    },
    memberWrap: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    titleMain: {
        fontFamily: FONT_SF.SEMIBOLD,
        fontSize: responsiveFontSize(2),
        paddingBottom: PD.PADDING_1,
        paddingTop: PD.PADDING_4,
        color: Colors.MAIN_COLOR
    },
    addMemberWrap: {
        flexDirection: "row",
        alignItems: "center"
    },
    addMemIcon: {
        bottom: -7,
        marginLeft: 4,
        color: Colors.MAIN_COLOR
    },
    spinnerWrap: {
        position: "absolute",
        zIndex: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        height: DEVICE.DEVICE_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        // borderRadius: (DIMENSION.H3 - 8) / 2,
        justifyContent: "center"
    }
};
