import { Const, GlobalStyles, Helper, ServiceHandle, Colors, Images } from "helper/index";
import { FONT_SF } from "assets";

const styles = {
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_COLOR
    },
    body: {
        flex: 1,
        width: "100%",
        paddingHorizontal: Const.PD.PADDING_6 * 1.5,
        alignItems: "center"
    },
    input: {
        height: Const.DIMENSION.BUTTON_HEIGHT - 4
    },
    view: {
        height: Const.DIMENSION.BUTTON_RADIUS
    },
    avatar: {
        height: Const.DIMENSION.H3 * 0.4,
        aspectRatio: 1
    },
    button: {
        width: "60%",
        height: Const.DIMENSION.BUTTON_HEIGHT - 8
        // marginTop: Const.PD.PADDING_6 * 1.4
    },
    text: {
        textAlign: "center",
        fontFamily: FONT_SF.SEMIBOLD,
        fontSize: Const.FONT_SIZE.HEADER
    },
    textView: {
        flex: 0.7,
        justifyContent: "center"
    },
    image: {
        width: "62%",
        aspectRatio: 1
    },
    content: {
        flex: 1,
        width: "100%",
        alignItems: "center"
    },
    footer: {
        height: 50
    }
};
export default styles;
