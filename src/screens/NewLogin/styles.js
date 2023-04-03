import { Colors } from "helper";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const STATUS_BAR_HEIGHT = DIMENSION.STATUS_BAR_HEIGHT;
const HEADER_HEIGHT = DIMENSION.HEADER_HEIGHT;

const styles = {
    input: {
        width: "100%",
        marginTop: 10,
        marginBottom: 25,
        backgroundColor: Colors.WHITE_COLOR,
        borderRadius: 25,
        fontSize: 18,
        textAlign: 'center',
        fontStyle: "italic",
        padding: PD.PADDING_3
    },
    inputsWrap: {
        width: "100%",
        padding: 16,
        marginTop: 30
    },
    icon: {
        height: 20,
        width: 20
    },
    back: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        position: "absolute",
        zIndex: 2,
        top: 0,
        height: STATUS_BAR_HEIGHT + HEADER_HEIGHT,
        width: "12.5%"
    },
    viewGreeting: {
        marginTop: 0.03 * DEVICE.DEVICE_HEIGHT,
        height: 0.05 * DEVICE.DEVICE_HEIGHT,
    },
    txtGreeting: {
        color: Colors.WHITE_COLOR,
        fontStyle: "italic",
        fontSize: responsiveFontSize(1.8),
        textAlign: 'center'
    },
    txtName: {
        color: Colors.WHITE_COLOR,
        fontStyle: "italic",
        fontSize: responsiveFontSize(2.2),
        fontWeight: "bold"
    }
};
export default styles;
