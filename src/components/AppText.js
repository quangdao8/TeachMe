/* eslint-disable react/prefer-stateless-function */
import { Text } from "react-native";
import React from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "../assets";

export default class AppText extends React.Component {
    render() {
        const { style, text, numberOfLines, onPress = () => {}, canPress = false } = this.props;
        if (canPress) {
            return (
                <Text
                    onPress={() => onPress()}
                    ellipsizeMode="tail"
                    numberOfLines={numberOfLines}
                    allowFontScaling={false}
                    style={[styles.text, style]}
                >
                    {text}
                    {this.props.children}
                </Text>
            );
        } else {
            return (
                <Text
                    ellipsizeMode="tail"
                    numberOfLines={numberOfLines}
                    allowFontScaling={false}
                    style={[styles.text, style]}
                >
                    {text}
                    {this.props.children}
                </Text>
            );
        }
    }
}

let styles = {
    text: {
        color: "black",
        fontSize: responsiveFontSize(1.6),
        fontFamily: FONT_SF.REGULAR
    }
};
