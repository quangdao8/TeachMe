import { Dimensions, Platform } from "react-native";
import { PD, DEVICE } from "helper/Consts";
import { Colors, ServiceHandle } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { DatePicker } from "native-base";

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
        marginBottom: 4,
        fontWeight: "bold",
        textAlign: "center"
    },
    iconStyle: {
        height: 25,
        width: 25,
        marginLeft: PD.PADDING_3
    }
};
