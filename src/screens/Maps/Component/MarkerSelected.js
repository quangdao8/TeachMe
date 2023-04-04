import React from "react";
import { Image, View } from "react-native";
import { Marker } from "react-native-maps";
import { ICON, FONT_SF } from "assets";
import { Colors } from "helper";
import { AppText, AppImage } from "components";
import { FONT_SIZE } from "helper/Consts";
import FastImage from "react-native-fast-image";

const MarkerSelected = props => {
    let { coords, icon = ICON.HART, onPress = () => {}, text = "" } = props;
    return (
        <Marker {...props} onPress={(coordinate, position) => onPress(coordinate, position)} coordinate={coords}>
            <View style={styles.container}>
                <View style={styles.wrapColor}>
                    <AppImage local source={icon} style={styles.mapMarker} resizeMode="contain" />
                    <AppText text={text} style={styles.text} />
                </View>
            </View>
        </Marker>
    );
};

const styles = {
    mapMarker: {
        height: 18,
        width: 18
    },
    container: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        padding: 4,
        borderRadius: 30
    },
    wrapColor: {
        backgroundColor: Colors.PINK_COLOR,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        marginLeft: 8,
        color: "#ffffff",
        fontSize: FONT_SIZE.CONTENT_SIZE,
        fontFamily: FONT_SF.MEDIUM
    }
};

export default MarkerSelected;
