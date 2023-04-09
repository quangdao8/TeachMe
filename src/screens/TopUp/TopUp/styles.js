import { PD } from "helper/Consts";
import { Colors, GlobalStyles, Const } from "helper";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default {
    container: {
        backgroundColor: Colors.SKY_BLUE,
        flex: 1
    },
    itemWrap: [
        {
            padding: PD.PADDING_2
        },
        GlobalStyles.shadowStyle2
    ],
    innerWrap: [
        {
            height: 75,
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: Colors.MAIN_COLOR,
            borderRadius: PD.PADDING_1
        },
        GlobalStyles.shadowStyle2
    ],
    innerWrapInActive: [
        {
            height: 75,
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: Colors.WHITE_COLOR,
            borderRadius: PD.PADDING_1
        },
        GlobalStyles.shadowStyle2
    ],
    titleMiddle: {
        textAlign: "center",
        fontSize: responsiveFontSize(2.3),
        fontFamily: FONT_SF.MEDIUM
    },
    moneyText: {
        textAlign: "center",
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.MEDIUM,
        fontSize: responsiveFontSize(2)
    },
    moneyTextInActive: {
        textAlign: "center",
        color: Colors.BLACK_TEXT_COLOR,
        fontFamily: FONT_SF.MEDIUM,
        fontSize: responsiveFontSize(2)
    },
    descMiddle: {
        textAlign: "center",
        fontSize: responsiveFontSize(2),
        fontFamily: FONT_SF.LIGHT
    },
    btnStyle: {
        fontSize: responsiveFontSize(2)
    },
    webview: {
        height: Const.DEVICE.DEVICE_HEIGHT - Const.DIMENSION.HEADER_HEIGHT * 1.5,
        paddingBottom: 0
    }
};
