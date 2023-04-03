import React from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import { ICON } from "../assets";
import { DIMENSION } from "../helper/Consts";
import { Icon } from "native-base";
import { AppImage } from "../components";

/**
 * @props
 * @props @image => use @source : @iconName
 */

export default class AppImageCircle extends React.PureComponent {
    checkedImage() {
        let { styleImageCheck, checkedContainer } = this.props;
        return (
            <View style={[styles.checkedContainer, checkedContainer]}>
                <AppImage
                    {...this.props}
                    style={[styles.icon, styles.imageChecked, styleImageCheck]}
                    source={ICON.CHECKED_WHITE}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={[styles.checkedWrap, checkedContainer]} />
            </View>
        );
    }

    render() {
        let {
            styleImage = {},
            source,
            checked,
            resizeMode = FastImage.resizeMode.contain,
            image,
            iconName = "call",
            iconType = "Ionicons",
            outterCStyle = {},
            middleCStyle = {},
            innerCStyle = {}
        } = this.props;
        return (
            <View style={[styles.circle1, outterCStyle]}>
                <View style={[styles.circle2, middleCStyle]}>
                    <View style={[styles.circle3, innerCStyle]}>
                        {checked ? this.checkedImage() : null}
                        {image ? (
                            <AppImage
                                {...this.props}
                                style={[styles.image, styleImage]}
                                source={source}
                                resizeMode={resizeMode}
                            />
                        ) : (
                            <Icon name={iconName} type={iconType} style={[styles.icon, styleImage]} />
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const H1 = DIMENSION.H1;
const H2 = DIMENSION.H2;
const H3 = DIMENSION.H3;

const styles = {
    circle1: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        height: H1,
        width: H1,
        borderRadius: H1 / 2,
        alignItems: "center",
        justifyContent: "center"
    },
    circle2: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        height: H2,
        width: H2,
        borderRadius: H2 / 2,
        alignItems: "center",
        justifyContent: "center"
    },
    circle3: {
        backgroundColor: "rgb(255, 255, 255)",
        height: H3,
        width: H3,
        borderRadius: H3 / 2,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "rgba(193, 193, 193, 0.8)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 3,
        shadowOpacity: 1,
        elevation: 4
    },
    image: {
        height: H3 - 8,
        width: H3 - 8,
        borderRadius: H3 / 2
    },
    icon: {
        height: 30,
        width: 30
    },
    checkedWrap: {
        backgroundColor: "rgba(0, 174, 239, 0.5)",
        position: "absolute",
        alignItems: "center",
        height: H3 - 4,
        width: H3 - 4,
        borderRadius: (H3 - 4) / 2,
        top: H3 / 2,
        left: H3 / 2,
        transform: [{ translateX: -H3 / 2 }, { translateY: -H3 / 2 }],
        zIndex: -1
    },
    checkedContainer: {
        position: "absolute",
        height: H3 - 4,
        width: H3 - 4,
        borderRadius: (H3 - 4) / 2,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1
    },
    imageChecked: {
        // position: "absolute",
        zIndex: 2
    }
};
