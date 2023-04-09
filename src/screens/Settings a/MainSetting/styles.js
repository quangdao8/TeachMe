import { PD } from "helper/Consts";
import { Colors } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default {
    wrapLang: {
        width: "100%",
        marginVertical: PD.PADDING_2,
        paddingVertical: PD.PADDING_3,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#b5b5b5",
        paddingHorizontal: PD.PADDING_4,
        backgroundColor: Colors.WHITE_COLOR
    },
    btnWrap: {
        position: "absolute",
        right: PD.PADDING_4,
        flexDirection: "row",
        borderColor: Colors.GRAY_TEXT_COLOR,
        borderWidth: 1,
        borderRadius: 6
    },
    btn: {
        borderRadius: 4,
        paddingHorizontal: PD.PADDING_4,
        paddingVertical: PD.PADDING_2
    },
    version: {
        marginLeft: PD.PADDING_4,
        fontSize: responsiveFontSize(2.1)
    },
    verText: {
        right: PD.PADDING_4,
        position: "absolute",
        color: Colors.GRAY_TEXT_COLOR,
        fontSize: responsiveFontSize(2.1)
    },
    language: {
        marginLeft: PD.PADDING_4,
        marginRight: PD.PADDING_6,
        fontSize: responsiveFontSize(2.1)
    }
};
