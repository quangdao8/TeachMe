import React from 'react';
import { Marker } from 'react-native-maps';
import { ICON } from 'assets';
import FastImage from 'react-native-fast-image';
import { AppImage } from 'components';

const Markers = props => {
    let {
        coords,
        // icon = require("../../../../android/app/src/main/res/mipmap-mdpi/ic_laucher_round.png"),
        icon = ICON.MARKER_BLUE,
        onPress = () => {}
    } = props;

    return (
        <Marker {...props} onPress={(coordinate, position) => onPress(coordinate, position)} coordinate={coords}>
            <AppImage local source={icon} style={styles.mapMarker} resizeMode="contain" />
        </Marker>
    );
};

const styles = {
    mapMarker: {
        height: 40,
        width: 40
    }
};

export default Markers;
