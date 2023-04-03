import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Colors, Const, GlobalStyles } from "../helper";
import AppText from "./AppText";
import { IconImage } from "../components";
import { DIMENSION } from "../helper/Consts";
import { FONT_SF } from "../assets";

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClicked: false
        };
    }

    onPress = () => {
        const { isClicked } = this.state;
        const { onPress } = this.props;
        if (!isClicked) {
            onPress();
            // this.setState({ isClicked: true });
            // setTimeout(() => {
            //     this.setState({ isClicked: false });
            // }, 200);
        }
    };

    leftIcon(leftIcon, renderLeftIcon, lIconStyle, rightIcon) {
        if (leftIcon || renderLeftIcon) {
            if (renderLeftIcon) {
                return <View style={[styles.leftIcon, lIconStyle]}>{renderLeftIcon}</View>;
            } else if (leftIcon) {
                return <IconImage local source={leftIcon} style={[styles.leftIcon, lIconStyle]} />;
            }
        } else return null;
    }

    rightIcon(rightIcon, renderRightIcon, rIconStyle, leftIcon) {
        if (rightIcon || renderRightIcon) {
            if (renderRightIcon) {
                return <View style={[styles.rightIcon, rIconStyle]}>{renderRightIcon}</View>;
            } else if (rightIcon) {
                return <IconImage local source={rightIcon} style={[styles.rightIcon, rIconStyle]} />;
            }
            // } else if (leftIcon) {
            //     return <View style={styles.rightIcon} />;
        } else return null;
    }

    render() {
        const {
            style,
            title = "",
            isShadow,
            leftIcon,
            lIconStyle,
            tStyle,
            rightIcon,
            rIconStyle,
            transparent,
            renderLeftIcon,
            renderRightIcon,
            centerContent
        } = this.props;
        return (
            <TouchableOpacity
                {...this.props}
                onPress={() => this.onPress()}
                style={[
                    styles.containerStyle,
                    isShadow ? GlobalStyles.shadowStyle : null,
                    transparent ? GlobalStyles.transparent : null,
                    style
                ]}
            >
                {this.leftIcon(leftIcon, renderLeftIcon, lIconStyle, rightIcon)}
                {centerContent ? (
                    centerContent
                ) : (
                    <AppText style={[styles.title, tStyle]} text={title} onPress={() => this.onPress()} />
                )}
                {this.rightIcon(rightIcon, renderRightIcon, rIconStyle, leftIcon)}
            </TouchableOpacity>
        );
    }
}

let styles = {
    containerStyle: {
        paddingHorizontal: DIMENSION.BUTTON_HEIGHT / 2,
        height: DIMENSION.BUTTON_HEIGHT,
        borderRadius: DIMENSION.BUTTON_RADIUS,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: Colors.MAIN_COLOR,
        flexDirection: "row",
        fontFamily: FONT_SF.BOLD
        // width: "80%"
    },
    title: {
        // flex: 3,
        textAlign: "center",
        color: "white",
        // fontWeight: "bold",
        fontSize: Const.FONT_SIZE.CONTENT_SIZE,
        fontFamily: FONT_SF.BOLD
    },
    rightIcon: {
        marginLeft: Const.PD.PADDING_3
    },
    leftIcon: {
        marginRight: Const.PD.PADDING_3
    }
};
