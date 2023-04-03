import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { Item, Input, Label, Icon, Thumbnail } from "native-base";
import FastImage from "react-native-fast-image";
import { ICON } from "../assets";
import { FONT_SIZE, DIMENSION } from "../helper/Consts";
import { Colors } from "../helper";
import { AppImage } from "../components";

const FloatCalendar = (props = { label, onPress, value, icon, iconStyle, containerStyle }) => {
    let {
        label = "",
        onPress = () => {},
        value = "",
        icon = ICON.CALENDAR,
        iconStyle = {},
        containerStyle = {}
    } = props;
    return (
        <TouchableWithoutFeedback onPress={() => onPress()}>
            <View style={[styles.itemWrap, containerStyle]}>
                <View style={{ flex: 10 }}>
                    <Item floatingLabel style={{ borderBottomWidth: 0 }}>
                        <Label>{label}</Label>
                        <Input
                            ref={ref => refInput(ref)}
                            value={value}
                            onTouchEnd={() => onPress()}
                            disabled={true}
                            style={styles.input}
                        />
                    </Item>
                </View>
                <View style={styles.iconWrap}>
                    <AppImage source={icon} style={[styles.icon, iconStyle]} resizeMode={"contain"} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = {
    itemWrap: {
        flex: 1,
        height: DIMENSION.INPUT_HEIGHT,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_BOTTOM_INPUT
    },
    input: {
        fontSize: FONT_SIZE.INPUT,
        height: DIMENSION.INPUT_HEIGHT
    },
    icon: {
        height: 20,
        width: 20
    },
    iconWrap: {
        flex: 1,

        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    }
};

export default FloatCalendar;
