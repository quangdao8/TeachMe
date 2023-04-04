import { Dimensions, Platform } from "react-native";
import { PD, DEVICE } from "helper/Consts";
import { Colors, ServiceHandle } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { DatePicker } from "native-base";
import { FONT_SF } from "assets";

export default {
    btnDelete: {
        flexDirection: "row",
        marginTop: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginLeft: PD.PADDING_4,
        borderBottomColor: Colors.WHITE_COLOR,
        borderBottomWidth: 1
    },
    textDelete: {
        fontSize: responsiveFontSize(2.5),
        textAlign: "center",
        marginLeft: PD.PADDING_3
    },
    btnShare: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: PD.PADDING_4,
        paddingVertical: 10,
        borderBottomColor: Colors.WHITE_COLOR,
        borderBottomWidth: 1,
        marginTop: DEVICE.DEVICE_HEIGHT * 0.08
    },
    textShare: {
        fontSize: responsiveFontSize(2.5),
        textAlign: "center",
        marginLeft: PD.PADDING_3
    },
    textPhone: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(2.5),
        marginTop: 4,
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    iconStyle: {
        height: 25,
        width: 25,
        marginLeft: PD.PADDING_3
    },
    itemWrap: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "45%"
    },
    itemCard: {
        flexDirection: "column",
        // alignItems: "flex-start",
        justifyContent: "center",
        width: "55%"
    },
    reviewPointGray: {
        marginTop: PD.PADDING_3,
        fontSize: responsiveFontSize(2),
        alignSelf: "center",
        color: Colors.GRAY_TEXT_COLOR
    },
    reviewPoint: {
        marginTop: PD.PADDING_3,
        fontSize: responsiveFontSize(2),
        alignSelf: "center"
    },
    descriptionTxt: {
        marginTop: PD.PADDING_3,
        fontSize: responsiveFontSize(2.25),
        color: Colors.GRAY_TEXT_COLOR,
        width: "100%"
    },
    consultantFeeTxt: {
        marginTop: PD.PADDING_3,
        fontSize: responsiveFontSize(2.5),
        alignSelf: "center",
        fontFamily: FONT_SF.BOLD
    },
    onlineTimeTxt: {
        color: Colors.DIABLED_BUTTON,
        fontSize: responsiveFontSize(1.75),
        textAlign: "center",
        marginVertical: PD.PADDING_2
    },
    realNameTxt: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(2.75),
        textAlign: "center",
        fontWeight: "bold",
        marginTop: PD.PADDING_2
    },
    titleItemWrap: {
        paddingLeft: PD.PADDING_2,
        justifyContent: "center",
        flex: 1
    },
    titleItemTxt: {
        color: Colors.GRAY_TEXT_COLOR,
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveFontSize(2.8)
    }
};
