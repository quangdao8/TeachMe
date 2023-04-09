import { Const, GlobalStyles, Helper, ServiceHandle, Colors, Images } from "helper/index";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const styles = {
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_COLOR
    },
    body: {
        paddingHorizontal: Const.PD.PADDING_6
    },
    view: {
        height: Const.PD.PADDING_3
    },
    header: {
        paddingVertical: Const.PD.PADDING_4
    },
    headerText: {
        fontSize: responsiveFontSize(2.1),
        textAlign: "justify",
        color: "#4a4a4a"
        // fontFamily: FONT_SF.MEDIUM,
    },
    content: {
        backgroundColor: "#f7f7f7",
        padding: Const.PD.PADDING_4
    },
    contentText: {
        fontSize: responsiveFontSize(2),
        color: Colors.GRAY_TEXT_COLOR,
        textAlign: "justify"
    },
    webview: {
        height: Const.DEVICE.DEVICE_HEIGHT - Const.DIMENSION.HEADER_HEIGHT * 1.5,
        paddingBottom: 0
    }
};
export default styles;
