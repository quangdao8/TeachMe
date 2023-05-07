import { DEVICE, PD, DIMENSION } from "helper/Consts";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";

export default {
    modal: {
        position: "absolute",
        top: 0,
        left: 0,
        height: DEVICE.DEVICE_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 3,
        justifyContent: "center",
        alignItems: "center"
    },
    noteView: {
        height: DEVICE.DEVICE_HEIGHT / 1.5,
        width: DEVICE.DEVICE_WIDTH / 1.2,
        backgroundColor: "#fff",
        justifyContent: "space-evenly",
        borderRadius: 10,
        paddingHorizontal: PD.PADDING_6
    },
    noteText: {
        fontFamily: FONT_SF.MEDIUM,
        fontSize: responsiveFontSize(3.2),
        textAlign: "center"
    },
    noteContentView: {
        borderColor: "lightgrey",
        borderWidth: 1,
        height: DEVICE.DEVICE_HEIGHT / 3
    },
    noteContent: {
        fontSize: responsiveFontSize(2.5),
        textAlign: "justify",
        paddingVertical: PD.PADDING_2
    },
    scroll: {
        paddingHorizontal: PD.PADDING_4
    },
    nameText: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(2.75),
        // marginTop: 4,
        textAlign: "center",
        fontWeight: "bold"
    },
    onlineText: {
        color: Colors.DIABLED_BUTTON,
        fontSize: responsiveFontSize(1.75),
        // marginTop: 4,
        textAlign: "center"
        // fontWeight: "bold",
    },
    phoneText: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(2.5),
        // marginTop: 4,
        // marginBottom: 4,
        fontWeight: "bold",
        textAlign: "center"
    },
    iconButton: {
        height: 25,
        width: 25
    },
    content: {
        flex: 1,
        justifyContent: "space-evenly",
        marginBottom: DIMENSION.BUTTON_HEIGHT / 2
    }
};
