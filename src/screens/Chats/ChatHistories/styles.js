import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import { PD, DEVICE } from "helper/Consts";

export default {
    container: {
        flex: 1
        // backgroundColor: "skyblue"
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
    modal: {
        position: "absolute",
        top: 0,
        left: 0,
        height: DEVICE.DEVICE_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    optionView: {
        height: DEVICE.DEVICE_HEIGHT / 1.5,
        width: DEVICE.DEVICE_WIDTH / 1.2,
        backgroundColor: "#fff",
        justifyContent: "space-evenly",
        borderRadius: 10,
        paddingHorizontal: PD.PADDING_6
    },
    swiper: {
        borderBottomWidth: 0,
        paddingVertical: 0,
        backgroundColor: Colors.CONTENT_COLOR,
        width: DEVICE.DEVICE_WIDTH,
        height:
            DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH < 2 ? DEVICE.DEVICE_HEIGHT * 0.15 : DEVICE.DEVICE_HEIGHT * 0.14
    },
    functionWrap: {
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: PD.PADDING_2,
        paddingVertical: PD.PADDING_2,
        justifyContent: "space-evenly",
        height: "100%"
    }
};
