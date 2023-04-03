import React from "react";
import FastImage from "react-native-fast-image";
import { AppImage } from "../components";

const IconImage = props => {
    let { source, resizeMode = FastImage.resizeMode.contain, style = {}, local = true } = props;
    return <AppImage local={local} {...props} source={source} resizeMode={resizeMode} style={[styles.icon, style]} />;
};

const styles = {
    icon: {
        width: 25,
        height: 25
    }
};

export default IconImage;
