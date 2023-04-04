import { DEVICE, DIMENSION, PD } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";

export default {
    container: {
        flex: 1
        // backgroundColor: "skyblue"
    },
    modal: {
        position: "absolute",
        bottom: 0,
        left: 0,
        height: DEVICE.DEVICE_HEIGHT - DIMENSION.STATUS_BAR_HEIGHT - DIMENSION.HEADER_HEIGHT - 50,
        // height: 200,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 3,
        justifyContent: "center"
    },
    empty: {
        textAlign: "center",
        height: DEVICE.DEVICE_HEIGHT / 2,
        paddingTop: DEVICE.DEVICE_HEIGHT / 5,
        fontSize: responsiveFontSize(2.4),
        color: Colors.MAIN_COLOR
    },
    noResult: {
        textAlign: "center",
        height: DEVICE.DEVICE_HEIGHT,
        paddingTop: PD.PADDING_4,
        fontSize: responsiveFontSize(2.5),
        color: Colors.MAIN_COLOR
    },
    swiper: {
        width: DEVICE.DEVICE_WIDTH,
        height:
            DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH < 2 ? DEVICE.DEVICE_HEIGHT * 0.15 : DEVICE.DEVICE_HEIGHT * 0.14
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
