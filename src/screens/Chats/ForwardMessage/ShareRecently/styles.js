import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import { PD } from "helper/Consts";

export default {
    container: {
        flex: 1
        // backgroundColor: "skyblue"
    },
    emptyText: {
        fontSize: responsiveFontSize(2.5),
        color: Colors.MAIN_COLOR,
        textAlign: "center"
    },
    emptySuggest: {
        fontSize: responsiveFontSize(2),
        color: Colors.MAIN_COLOR,
        textAlign: "center"
    },
    containerEmpty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: PD.PADDING_4
    }
};
