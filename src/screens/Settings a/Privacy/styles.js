import { Const, GlobalStyles, Helper, ServiceHandle, Colors, Images } from "helper/index";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { PD } from "helper/Consts";

const styles = {
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_COLOR
    },
    view: {
        justifyContent: "flex-end",
        height: PD.PADDING_3,
        paddingHorizontal: Const.PD.PADDING_4
    },
    text: {
        fontSize: responsiveFontSize(2.1)
        // fontFamily: FONT_SF.BOLD
    }
};
export default styles;
