import { PD, DEVICE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";

export default {
    itemWrap: {
        flexDirection: "row",
        width: DEVICE.DEVICE_WIDTH,
        paddingVertical: PD.PADDING_4,
        paddingHorizontal: PD.PADDING_4,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: Colors.WHITE_COLOR
    },
    container: {
        paddingVertical: PD.PADDING_4,
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: PD.PADDING_4,
        borderBottomColor: "#fff",
        borderBottomWidth: 1
    },
    content: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    moneyText: {
        color: Colors.MAIN_COLOR,
        // fontWeight: "300",
        fontSize: responsiveFontSize(2.5)
    },
    containerEmpty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: PD.PADDING_4
    },
    emptyText: {
        fontSize: responsiveFontSize(2.5),
        color: Colors.MAIN_COLOR,
        textAlign: "center"
    }
};
