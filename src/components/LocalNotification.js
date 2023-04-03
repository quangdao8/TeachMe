import React, { PureComponent, Component } from "react";
import { connect } from "react-redux";
import { View, Animated, StatusBar, Platform, TouchableOpacity } from "react-native";
import { DIMENSION, DEVICE, PD } from "../helper/Consts";
import { AppText } from "components";
import { FONT_SF } from "assets";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { localNotificationActions } from "actions";
import { OPEN_LOCAL_NOTIFICATION } from "actions/types";

const { STATUS_BAR_HEIGHT } = DIMENSION;
const POSITION = DEVICE.DEVICE_HEIGHT * 0.15 + STATUS_BAR_HEIGHT;

class LocalNotification extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(-POSITION),
            endNotification: false,
            title: {
                name: "",
                group_name: ""
            }
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }

    openNoti(title, body, onPress) {
        // Platform.OS == "ios" && StatusBar.setHidden(true, "fade");
        this.setState({ endNotification: false, title, body, onPress }, () => {
            Animated.spring(this.state.translateY, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }).start();
        });
        if (this.close) {
            clearTimeout(this.close);
        }

        this.close = setTimeout(() => {
            this.closeNoti();
        }, 3000);
    }

    closeNoti() {
        // Platform.OS == "ios" && StatusBar.setHidden(false, "slide");
        this.setState({ endNotification: true }, () => {
            Animated.spring(this.state.translateY, {
                toValue: -POSITION,
                duration: 1000,
                useNativeDriver: true
            }).start();
        });
    }

    componentWillUnmount() {}

    render() {
        const { reminder } = this.props;
        const { endNotification } = this.state;
        const { title, body, onPress } = this.state;
        let name = title.name;
        let group_name = title.group_name;

        return !reminder ? (
            <Animated.View style={[styles.container, { transform: [{ translateY: this.state.translateY }] }]}>
                <TouchableOpacity
                    onPress={() => {
                        setTimeout(() => {
                            this.closeNoti();
                        }, 300);
                        onPress();
                    }}
                >
                    <View>
                        <AppText
                            numberOfLines={1}
                            // text={name}
                            // style={[styles.title, endNotification && { color: "transparent" }]}
                        >
                            <AppText text={name} style={[styles.title, endNotification && { color: "transparent" }]} />
                            <AppText
                                text={group_name ? "  gửi tới  " : ""}
                                style={[styles.content, { width: "auto" }, endNotification && { color: "transparent" }]}
                            />
                            <AppText
                                // numberOfLines={1}
                                text={group_name}
                                style={[styles.title, endNotification && { color: "transparent" }]}
                            />
                        </AppText>
                        <AppText
                            numberOfLines={1}
                            text={body}
                            style={[styles.content, endNotification && { color: "transparent" }]}
                        />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        ) : (
            <Animated.View style={[styles.container, { transform: [{ translateY: this.state.translateY }] }]}>
                <TouchableOpacity
                    onPress={() => {
                        this.closeNoti();
                    }}
                >
                    <View>
                        <AppText text={body} style={[styles.content, endNotification && { color: "transparent" }]} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

function mapStateToProps(state) {
    return {
        localNoti: state.localNotificationReducer
    };
}
LocalNotification = connect(mapStateToProps)(LocalNotification);
export default LocalNotification;

const styles = {
    container: {
        position: "absolute",
        // marginTop: DIMENSION.STATUS_BAR_HEIGHT,
        // height: DEVICE.DEVICE_HEIGHT * 0.15,
        backgroundColor: "rgba(235,235,240,0.95)",
        width: DEVICE.DEVICE_WIDTH,
        shadowColor: "#cccccc",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: PD.PADDING_4,
        shadowOpacity: 0.5,
        borderRadius: PD.PADDING_4,
        paddingHorizontal: PD.PADDING_4,
        marginTop: STATUS_BAR_HEIGHT,

        paddingVertical: PD.PADDING_2,
        paddingBottom: PD.PADDING_1,
        zIndex: 9999999
    },
    title: {
        fontFamily: FONT_SF.SEMIBOLD,
        fontSize: responsiveFontSize(2.5)
    },
    content: {
        fontFamily: FONT_SF.REGULAR,
        fontSize: responsiveFontSize(2),
        width: DEVICE.DEVICE_WIDTH * 0.9,
        lineHeight: responsiveFontSize(3.5)
    }
};
