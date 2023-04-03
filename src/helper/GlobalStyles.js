import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "../helper";

const GlobalStyles = {
    shadowStyle: {
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 4
    },
    tabShadowStyle: {
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowOffset: {
            width: 0,
            height: -2
        },
        shadowRadius: 4,
        shadowOpacity: 1,
        elevation: 20
    },
    transparent: {
        backgroundColor: "rgba(0, 0, 0, 0.2)"
    },
    shadowWhite: {
        shadowColor: "rgba(255, 255, 255, 0.6)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 4
    },
    iconWhite: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(3)
    },
    shadowStyle2: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 4
    }
};

export default GlobalStyles;
