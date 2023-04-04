import { FONT_SIZE, DEVICE } from "helper/Consts";
import { Colors, Const } from "helper";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const styles = {
    container: {
        flex: 1
    },
    maps: {
        flex: 9
    },
    mapMarker: {
        height: 35,
        width: 35
    },
    txtHeader: {
        textAlign: "center",
        color: "#ffffff",
        fontSize: FONT_SIZE.HEADER,
        fontFamily: FONT_SF.MEDIUM
    },
    content: {
        height: 50,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: Colors.MAIN_COLOR,
        zIndex: 1,
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    upPanelWrap: {
        bottom: 0,
        left: 0,
        width: "100%",
        position: "absolute",
        zIndex: 2
    },
    leftIcon: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    input: {
        // flex: 1,
        padding: 0,
        fontSize: responsiveFontSize(2.2),
        minHeight: responsiveFontSize(4.95),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR,
        width: "100%"
    },
    containerModal: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    contentModal: {
        marginTop: "20%",
        alignItems: "center",
        witdh: "80%"
    },
    headerModal: {
        width: 60,
        height: 60,
        justifyContent: "center",
        borderRadius: 30,
        borderColor: "white",
        alignItems: "center",
        backgroundColor: Colors.WHITE_COLOR,
        zIndex: 999
    },
    bodyModal: {
        marginTop: -30,
        backgroundColor: "white",
        padding: 16,
        width: "80%",
        borderRadius: 5,
        alignItems: "center"
    },
    headerImage: {
        width: 50,
        height: 50,
        justifyContent: "center",
        borderRadius: 25,
        alignItems: "center"
    },
    titleAlert: {
        fontSize: Const.FONT_SIZE.TITLE,
        marginTop: 16,
        fontWeight: "500",
        color: "black"
    },
    contentAlert: {
        width: "80%",
        fontSize: Const.FONT_SIZE.CONTENT_SIZE + 2,
        marginTop: 6,
        textAlign: "center",
        marginBottom: 16,
        color: "black"
    }
};
export default styles;
