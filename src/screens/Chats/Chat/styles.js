import { PD, DIMENSION, DEVICE } from "helper/Consts";
import { Colors } from "helper";

export default {
    container: {
        flex: 1,
        backgroundColor: Colors.CONTENT_COLOR,
        height: DEVICE.DEVICE_HEIGHT,
        width: DEVICE.DEVICE_WIDTH
        // marginTop: DIMENSION.STATUS_BAR_HEIGHT + DIMENSION.HEADER_HEIGHT
    }
};
