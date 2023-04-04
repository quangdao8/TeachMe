import { DEVICE, PD } from "helper/Consts";
import { Const, Colors } from "helper/index";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

const styles = {
    //index
    input: {
        width: "70%",
        marginTop: 60,
        marginBottom: PD.PADDING_6
    },
    inputsWrap: {
        width: "100%",
        padding: PD.PADDING_4,
        marginTop: 30
    },
    btnNoteDisable: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        justifyContent: "center",
        alignItems: "center"
    },
    gradient: {
        height: DEVICE.DEVICE_HEIGHT,
        backgroundColor: "transparent",
        position: "absolute",
        opacity: 0.5,
        zIndex: 0,
        width: DEVICE.DEVICE_WIDTH
    },
    txtCallName: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(3.5),
        lineHeight: responsiveFontSize(4),
        fontFamily: FONT_SF.MEDIUM,
        marginTop: height / 9
    },
    viewBtn: {
        flexDirection: "row",
        marginTop: 30,
        justifyContent: "space-around",
        width: "100%",
        paddingHorizontal: 30
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: height / 5
    },
    txtCalling: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(3),
        lineHeight: responsiveFontSize(3.5)
    }
};
export default styles;
