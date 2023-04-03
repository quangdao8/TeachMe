import React from "react";
import { TouchableOpacity, View, FlatList, TouchableWithoutFeedback } from "react-native";
import { Colors, Const, GlobalStyles } from "helper";
import AppText from "./AppText";
import { IconImage } from "components";
import { DIMENSION, DEVICE, LANGUAGE_VIETNAM } from "helper/Consts";
import { Images, FONT_SF } from "assets";

export default class Picker extends React.Component {
    constructor(props) {
        super(props);
        const { language } = props;
        this.state = {
            isModalVisible: false,
            title: language.toUpperCase(),
            value: "",
            flag: language == LANGUAGE_VIETNAM ? Images.VIE : Images.ENG
        };
    }

    onPress = () => {
        const { isClicked } = this.state;
        const { onPress } = this.props;
        if (!isClicked) {
            onPress();
            this.setState({ isClicked: true });
            setTimeout(() => {
                this.setState({ isClicked: false });
            }, 200);
        }
    };

    leftIcon(leftIcon, renderLeftIcon, lIconStyle) {
        if (leftIcon || renderLeftIcon) {
            if (renderLeftIcon) {
                return <View style={[styles.leftIcon, lIconStyle]}>{renderLeftIcon}</View>;
            } else if (leftIcon) {
                return <IconImage source={leftIcon} style={[styles.leftIcon, lIconStyle]} />;
            }
        } else return null;
    }

    rightIcon(rightIcon, renderRightIcon, rIconStyle, leftIcon) {
        if (rightIcon || renderRightIcon) {
            if (renderRightIcon) {
                return <View style={[styles.rightIcon, rIconStyle]}>{renderRightIcon}</View>;
            } else if (rightIcon) {
                return <IconImage source={rightIcon} style={[styles.rightIcon, rIconStyle]} />;
            }
        } else return null;
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
    renderItem(item) {
        return (
            <TouchableOpacity onPress={() => this.clickItem(item)}>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 100,
                        minHeight: 40,
                        borderBottomColor: Colors.GRAY_TEXT_COLOR,
                        borderBottomWidth: 1,
                        backgroundColor: "#FFFFFF"
                    }}
                >
                    <AppText style={{ color: "black" }} text={item.countryCode} />
                </View>
            </TouchableOpacity>
        );
    }
    clickItem(item) {
        const { onPressItem = () => {} } = this.props;
        this.setState(
            {
                title: item.countryCode,
                flag: item.flag
            },
            () => {
                onPressItem(item.countryCode.toLowerCase());
            }
        );

        this.toggleModal();
    }
    renderTitle() {
        this.setState({
            title: this.state.countryCode
        });
    }
    render() {
        const {
            style,
            title = "",
            isShadow,
            leftIcon = this.state.flag,
            lIconStyle,
            tStyle,
            rightIcon,
            rIconStyle,
            transparent,
            renderLeftIcon,
            renderRightIcon,
            data
        } = this.props;
        return (
            <View>
                <TouchableOpacity
                    {...this.props}
                    onPress={() => this.toggleModal()}
                    style={[
                        styles.containerStyle,
                        isShadow ? GlobalStyles.shadowStyle : null,
                        transparent ? GlobalStyles.transparent : null,
                        style
                    ]}
                >
                    {this.leftIcon(leftIcon, renderLeftIcon, lIconStyle)}
                    <AppText style={[styles.title, tStyle]} text={this.state.title} />
                    {this.rightIcon(rightIcon, renderRightIcon, rIconStyle)}
                </TouchableOpacity>
                {this.state.isModalVisible && (
                    <View style={{ position: "relative", flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.toggleModal()}>
                            <View
                                style={{
                                    position: "absolute",
                                    width: DEVICE.DEVICE_WIDTH,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: DEVICE.DEVICE_HEIGHT
                                }}
                            >
                                <FlatList
                                    data={data}
                                    keyExtractor={(item, index) => `${index}`}
                                    renderItem={({ item }) => this.renderItem(item)}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                )}
            </View>
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
        flexDirection: "row"
        // width: "80%"
    },
    title: {
        // flex: 3,
        textAlign: "center",
        color: "white",
        // fontWeight: "bold",
        fontSize: Const.FONT_SIZE.CONTENT_SIZE,
        fontFamily: FONT_SF.REGULAR
        // backgroundColor: "red"
    },
    rightIcon: {
        marginLeft: Const.PD.PADDING_3
    },
    leftIcon: {
        marginRight: Const.PD.PADDING_3
    }
};
