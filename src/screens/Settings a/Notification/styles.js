import { Const, GlobalStyles, Helper, ServiceHandle, Colors, Images } from "helper/index";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const styles = {
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_COLOR
    },
    view: {
        justifyContent: "flex-end",
        height: Const.DIMENSION.INPUT_HEIGHT - 4,
        paddingHorizontal: Const.PD.PADDING_4,
        justifyContent: "center"
    },
    text: {
        fontSize: responsiveFontSize(2.1),
        fontFamily: FONT_SF.BOLD
    }
};
export default styles;
