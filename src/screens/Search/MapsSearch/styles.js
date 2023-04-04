import { Dimensions, Platform } from 'react-native';
import { PD, DEVICE, DIMENSION } from 'helper/Consts';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { DatePicker } from 'native-base';

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
        marginTop: PD.PADDING_5,
        width: '40%'
        // marginTop: DEVICE.DEVICE_HEIGHT*0.005
    },
    mg: {
        // marginTop: DEVICE.DEVICE_HEIGHT*0.01,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: 'center'
    },
    mg1: {
        marginVertical: PD.PADDING_4,
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
    }
};
