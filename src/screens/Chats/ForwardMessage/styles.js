import { Colors, Const } from "helper";
import { DEVICE } from "helper/Consts";
import { FONT_SF } from "assets";
const WIDTH = DEVICE.DEVICE_WIDTH;

export default {
    regularTab: {
        flex: 1,
        height: "100%",
        padding: 5,
        justifyContent: "space-between",
        alignItems: "center"
    },
    containerTabbar: {
        flexDirection: "row",
        height: 50,
        alignItems: "center",
        backgroundColor: Colors.MAIN_COLOR,
        position: "absolute",
        bottom: 0,
        width: WIDTH
    },
    tabTitle: {
        fontFamily: FONT_SF.MEDIUM,
        fontSize: Const.FONT_SIZE.CONTENT_SIZE,
        color: "white"
    }
};
