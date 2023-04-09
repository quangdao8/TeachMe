import React from "react";
import { View, TextInput, TouchableOpacity, Keyboard, Switch, Platform } from "react-native";
// import { Item, Input, Label, Picker } from "native-base";
import { ICON, FONT_SF } from "assets";
import { FONT_SIZE, DIMENSION, PD } from "helper/Consts";
import { Colors, Const } from "helper";
import { AppImage, AppText } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import moment from "moment";
import _ from "lodash";

const hitSlop = {
    top: PD.PADDING_2,
    bottom: PD.PADDING_2,
    left: PD.PADDING_2,
    right: PD.PADDING_2
};

class Liner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardShow: false,
            valueSwitch: true
        };

        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount() {
        let { initSwitch = true } = this.props;
        this.setState({ valueSwitch: initSwitch });
    }

    _keyboardDidShow = () => {
        this.setState({ keyboardShow: true });
    };

    _keyboardDidHide = () => {
        this.setState({ keyboardShow: false });
    };

    renderSwitch() {
        let { isSwitch, onValueChange = () => {} } = this.props;
        let { valueSwitch } = this.state;
        return isSwitch ? (
            <View style={styles.switchButton}>
                <Switch
                    hitSlop={hitSlop}
                    style={styles.switch}
                    value={valueSwitch}
                    trackColor={{ true: Colors.GREEN_COLOR }}
                    onValueChange={valueSwitch => {
                        this.setState({ valueSwitch }, () => {
                            onValueChange(valueSwitch);
                        });
                    }}
                    thumbColor={Platform.OS == "ios" ? { true: Colors.WHITE_COLOR } : Colors.WHITE_COLOR}
                />
            </View>
        ) : null;
    }

    render() {
        let { title, disabled = true, onPress = () => {} } = this.props;
        return (
            <TouchableOpacity style={styles.line} disabled={disabled} onPress={() => onPress()}>
                <AppText text={title} style={styles.title} />
                {this.renderSwitch()}
            </TouchableOpacity>
        );
    }
}

const styles = {
    line: {
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "space-between",
        alignItems: "center",
        height: Const.DIMENSION.INPUT_HEIGHT,
        paddingLeft: PD.PADDING_4,
        paddingRight: PD.PADDING_2,
        marginBottom: 1
    },
    title: {
        fontSize: responsiveFontSize(2.15)
    },
    switch: {
        transform: Platform.OS == "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [{ scaleX: 1 }, { scaleY: 1 }]
    }
};

export default Liner;
