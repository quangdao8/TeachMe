import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Input, Item, Form } from "native-base";
import { Colors, GlobalStyles, Const } from "../helper/index";
import { IconImage, AppText } from "../components";
import { PD, FONT_SIZE, DIMENSION } from "../helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Icon } from "native-base";
import { Validate } from "../helper";
import { FONT_SF } from "../assets";

const _ = require("lodash");
const hitSlop = {
    top: PD.PADDING_2,
    bottom: PD.PADDING_2,
    left: PD.PADDING_2,
    right: PD.PADDING_2
};

const HEIGHT_DEFAULT = DIMENSION.INPUT_HEIGHT;
/**
 * @props
 *  containerStyles,
    leftIcon,
    lStyle,
    lSource,
    inputStyle,
    placeholder,
    lBlurSource,
    value,
    transparent,
    placeholderTextColor,
    rStyle,
    rSource,
    clearButton,
    onFocus,
    onBlur
 * 
 */
export default class Inputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onFocus: false,
            text: "",
            errorMessage: null
        };
    }

    componentDidMount() {
        const { onRef } = this.props;
        if (onRef) {
            onRef(this);
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(null);
        }
    }

    onFocus() {
        let { onFocus = () => {} } = this.props;
        this.setState({ onFocus: true }, () => {
            onFocus();
        });
    }

    onBlur() {
        let { onBlur = () => {} } = this.props;
        this.setState({ onFocus: false }, () => {
            onBlur();
        });
    }

    onClear() {
        let { onClear = () => {} } = this.props;
        this.input._root.clear();
        onClear();
    }

    validateInput() {
        const { type, nameValue } = this.props;
        const { text } = this.state;
        const ValidateInput = new Validate(nameValue, text);
        switch (type) {
            case Const.INPUT_TYPE.EMAIL:
                return ValidateInput.validateEmail();
            case Const.INPUT_TYPE.PHONE_NUMBER:
                return ValidateInput.validatePhoneNumber();
            case Const.INPUT_TYPE.PASSWORD:
                return ValidateInput.validatePassword();
            default:
                return ValidateInput.validateBlank();
        }
    }

    renderClear() {
        let { rStyle, rSource = "ios-close", value, clearButton } = this.props;
        let { onFocus } = this.state;
        return (
            <View style={styles.rightWrap}>
                {clearButton && onFocus && value.length > 0 ? (
                    <TouchableOpacity onPress={() => this.onClear()} hitSlop={hitSlop} style={styles.clearButton}>
                        <Icon name={rSource} style={[styles.rightIcon, rStyle]} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }

    onChangeText(text) {
        const { onChangeText } = this.props;
        this.setState({ text });
        if (onChangeText) {
            onChangeText(text);
        }
    }

    render() {
        let {
            containerStyles,
            nameValue,
            leftIcon,
            lStyle,
            type,
            lSource,
            inputStyle,
            placeholder,
            lBlurSource,
            value,
            transparent,
            placeholderTextColor
        } = this.props;
        let { onFocus, errorMessage } = this.state;
        return (
            <Item rounded style={[styles.containerStyles, onFocus ? GlobalStyles.shadowStyle : {}, containerStyles]}>
                <View style={[styles.overlay, !onFocus && transparent ? GlobalStyles.transparent : null]} />
                <View style={styles.leftIcon}>
                    {leftIcon ? <IconImage source={onFocus ? lSource : lBlurSource} style={[lStyle]} /> : null}
                </View>
                <Input
                    {...this.props}
                    onChangeText={text => this.onChangeText(text)}
                    ref={ref => (this.input = ref)}
                    value={value}
                    onFocus={() => this.onFocus()}
                    onBlur={() => this.onBlur()}
                    style={[!onFocus && transparent ? styles.inputFocus : null, styles.input, inputStyle]}
                    placeholder={onFocus && transparent ? "" : placeholder}
                    allowFontScaling={false}
                    placeholderTextColor={placeholderTextColor ? placeholderTextColor : Colors.WHITE_COLOR}
                />
                {this.renderClear()}
            </Item>
        );
    }
}

const styles = {
    containerStyles: {
        flex: 1,
        borderColor: "transparent",
        marginLeft: 0,
        alignItems: "center",
        width: "80%"
    },
    errorText: {
        alignSelf: "center",
        marginTop: 8,
        color: "red"
    },
    leftIcon: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        width: "100%",
        height: "100%",
        flex: 6,
        textAlign: "center",
        fontSize: FONT_SIZE.INPUT,
        fontFamily: FONT_SF.REGULAR,
        height: HEIGHT_DEFAULT,
        margin: 0,
        padding: 0
    },
    rightIcon: {
        fontSize: responsiveFontSize(4.0)
    },
    rightWrap: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: DIMENSION.INPUT_HEIGHT,
        backgroundColor: Colors.WHITE_COLOR
    },
    bgWhite: {
        backgroundColor: Colors.WHITE_COLOR
    },
    inputFocus: {
        color: Colors.WHITE_COLOR
    },
    clearButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 4
    }
};
