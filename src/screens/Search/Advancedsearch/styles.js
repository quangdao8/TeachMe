import { Dimensions, Platform } from 'react-native';
import { PD, DEVICE, DIMENSION } from 'helper/Consts';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { DatePicker } from 'native-base';
import { Colors } from 'helper';
import { FONT_SF } from 'assets';

export default {
    title: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2.5),
        marginBottom: DEVICE.DEVICE_HEIGHT * 0.05
    },
    inputsWrap: {
        width: '100%',
        // padding:10,
        // marginTop: PD.PADDING_4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: DEVICE.DEVICE_HEIGHT * 0.01
    },
    button: {
        // marginTop: PD.PADDING_5
        // width: "40%"
        // marginTop: DEVICE.DEVICE_HEIGHT*0.005
    },
    buttonDis: {
        // marginTop: PD.PADDING_5,
        backgroundColor: Colors.DIABLED_BUTTON
    },
    mg: {
        // marginTop: DEVICE.DEVICE_HEIGHT*0.01,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: 'center',
        marginBottom: DEVICE.DEVICE_HEIGHT * 0.01
    },
    mg1: {
        marginVertical: PD.PADDING_3,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: 'center'
    },
    dropdown: {
        width: '80%',
        height: DIMENSION.INPUT_HEIGHT,
        borderRadius: DIMENSION.INPUT_RADIUS,
        backgroundColor: '#fff',
        marginBottom: DEVICE.DEVICE_HEIGHT * 0.02,
        paddingHorizontal: DEVICE.DEVICE_WIDTH * 0.05,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    error: {
        fontSize: responsiveFontSize(2.0),
        color: 'red',
        textAlign: 'center',
        marginTop: DEVICE.DEVICE_HEIGHT * 0.01
    },
    picker: {
        width: '100%',
        alignItems: 'center'
    },
    iconPicker: {
        height: 20,
        width: 20
    },
    imageWrap: {
        flex: 1,
        paddingBottom: PD.PADDING_1 * 0.8
    },
    pickerWrap: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        // height: 20,
        backgroundColor: 'pink'
    },
    itemStyle: {
        textAlign: 'center'
    },
    input: {
        // flex: 1,
        height: 0,
        padding: 0,
        fontSize: responsiveFontSize(2.2),
        minHeight: responsiveFontSize(4.95),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR,
        width: '100%'
    },
    briefInput: {
        height: 0,
        marginTop: PD.PADDING_2,
        padding: PD.PADDING_2 * 1.5,
        backgroundColor: 'white'
        // minHeight: responsiveFontSize(3.6)

        // marginTop: PD.PADDING_1
    },
    autoPicker: {
        flex: 1,
        backgroundColor: 'red'
    }
};
