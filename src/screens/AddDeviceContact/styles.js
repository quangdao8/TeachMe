import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import { PD } from "helper/Consts";

const styles = {
    container: {
        backgroundColor: Colors.BACKGROUND_COLOR,
        flex: 1
        // paddingTop: PD.PADDING_4
    },
    itemContainer: {
        backgroundColor: Colors.BACKGROUND_COLOR,
        borderBottomWidth: 1,
        borderBottomColor: Colors.WHITE_COLOR,
        paddingHorizontal: PD.PADDING_4,
        paddingVertical: PD.PADDING_2
    },
    txtName: {
        fontSize: responsiveFontSize(2.5),
        lineHeight: responsiveFontSize(3.25),
        paddingBottom: PD.PADDING_2
    },
    txtNumber: {
        fontSize: responsiveFontSize(2.5),
        lineHeight: responsiveFontSize(3.25),
        color: Colors.MAIN_COLOR
    },
    txtLabel: {
        fontSize: responsiveFontSize(2.5),
        lineHeight: responsiveFontSize(3.25),
        textTransform: "capitalize"
    },
    containerEmpty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: PD.PADDING_4
    },
    emptyText: {
        fontSize: responsiveFontSize(2.5),
        color: Colors.MAIN_COLOR,
        textAlign: "center"
    }
};
export default styles;
