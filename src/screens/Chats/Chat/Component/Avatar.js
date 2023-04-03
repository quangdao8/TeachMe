import React from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import { DEVICE, DIMENSION, PD } from "helper/Consts";
import { Images } from "assets";
import { AppImage } from "components";
const _ = require("lodash");
const Avatar = ({ source = Images.DEFAULT_AVATAR }) => {
    return (
        <View style={{ marginRight: -12 }}>
            <AppImage source={!source || _.isEmpty(source.uri) ? Images.DEFAULT_AVATAR : source} style={styles.image} />
        </View>
    );
};

const SIZE = DIMENSION.CHAT_AVATAR_WIDTH;

const styles = {
    image: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2
    }
};

export default Avatar;
