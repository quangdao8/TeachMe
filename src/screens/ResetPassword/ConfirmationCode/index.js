import React from "react";
import { View, StatusBar, Alert } from "react-native";
import { Button, AppText, Container, AppImageCircle, Input } from "components";
import { Colors, GlobalStyles, Const, Helper } from "helper";
import I18n from "helper/locales";
import styles from "./styles";
import { connect } from "react-redux";
import { ICON, FONT_SF } from "assets";
import HeaderApp from "components/Header";
import { types } from "actions";
import { requestConfirmCode } from "actions/forgotPassAction/confirmCodeAction";
import { VERIFY_TYPE } from "helper/Consts";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class ConfirmationCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            type: props.checkPhoneReducer.data.response.user.username.includes("@") ? "email" : "phone",
            phoneNumber: "",
            focus: false
        };
        this.inputRefs = {};
    }

    onContinue() {
        let { code, phoneNumber } = this.state;
        const { dispatch } = this.props;
        // const error = Helper.checkValid(this.inputRefs);
        phoneNumber = this.props.checkPhoneReducer.data.response.user.username;
        // if (!error) {
        let params = {
            username: phoneNumber,
            token: code,
            vefify_type: VERIFY_TYPE.RESET,
            key: 'YOLEARN'
        };
        dispatch(requestConfirmCode(params));
        // } else {
        //     this.setState({
        //         error
        //     });
        // }
    }

    componentDidUpdate(prevProps) {
        const { confirmCodeReducer, navigation } = this.props;

        if (prevProps.confirmCodeReducer !== confirmCodeReducer) {
            if (confirmCodeReducer.type === types.CONFIRM_CODE_FAILED) {
                setTimeout(() => {
                    // Alert.alert("Error", confirmCodeReducer.errorMessage);
                }, 50);
                return;
            }
            if (confirmCodeReducer.type === types.CONFIRM_CODE_SUCCESS) {
                navigation.navigate("ConfirmationSuccess");
                return;
            }
        }
    }
    onFocusChange = () => {
        this.setState({ focus: true });
    };
    onBlurChange = () => {
        this.setState({ focus: false });
    };

    phoneHiden() {
        const { checkPhoneReducer } = this.props;
        let username = checkPhoneReducer.data.response.user.username;
        let dot = "";
        let subString = "";
        if (username.includes("@")) {
            let split = username.split("@");
            subString = `@${split[1]}`;
            let dotNumber = split[0].length;
            if (dotNumber < 4) {
                for (let i = 0; i < dotNumber; i++) {
                    dot += "∙";
                }
            } else {
                dot = split[0].substring(0, 3);
                for (let i = 3; i < dotNumber; i++) {
                    dot += "∙";
                }
            }
        } else {
            for (let i = 0; i < username.length - 2; i++) {
                dot += "∙";
            }
            subString = username[username.length - 2] + username[username.length - 1]
        }
        return `${dot}${subString}`;
    }

    render() {
        const { navigation } = this.props;
        let { code, type, focus } = this.state;

        return (
            <Container contentContainerStyle={{ backgroundColor: Colors.CONTENT_COLOR }}>
                {/* <StatusBar backgroundColor={Colors.STATUSBAR} barStyle="light-content" translucent={true} /> */}
                <HeaderApp title={I18n.t("ConfirmationCodeScreen.confirmationCode")} isBack navigation={navigation} />
                <AppImageCircle
                    image
                    square
                    source={type === "phone" ? ICON.CALL : ICON.MAIL}
                    styleImage={{ width: 50, height: 50, borderRadius: 0 }}
                    outterCStyle={{ marginTop: 0.03 * height }}
                />
                {!focus && <AppText text={this.phoneHiden()} style={{ fontSize: 18, fontWeight: "bold" }} />}
                {!focus && (
                    <AppText
                        text={
                            type === "phone"
                                ? I18n.t("ConfirmationCodeScreen.sendSMS")
                                : I18n.t("ConfirmationCodeScreen.sendMail")
                        }
                        style={{ fontSize: 18, marginTop: 0.01 * height, textAlign: "center" }}
                    />
                )}
                {/* <AppText text={I18n.t("ConfirmationCodeScreen.enterCodeSMS")} style={{ fontSize: 18 }} /> */}
                <View style={styles.inputsWrap}>
                    <Input
                        inputStyle={{ fontSize: 20 }}
                        keyboardType="numeric"
                        // nameValue="phone"
                        // type={Const.INPUT_TYPE.PHONE_NUMBER}
                        // onRef={ref => (this.inputRefs["phoneNumber"] = ref)}
                        clearButton
                        leftIcon
                        lStyle={{ width: 0.025 * height, height: 0.025 * height }}
                        lSource={type === "phone" ? ICON.CALL : ICON.MAIL_BLUE}
                        placeholder={I18n.t("ConfirmationCodeScreen.confirmationCode")}
                        placeholderTextColor={Colors.DIABLED_BUTTON}
                        onChangeText={e => this.setState({ code: e })}
                        value={code}
                        containerStyles={{ width: "100%", marginTop: 0.04 * height }}
                        onFocus={this.onFocusChange}
                        onBlur={this.onBlurChange}
                    />
                    <Button
                        tStyle={{ fontSize: 18 }}
                        onPress={() => this.onContinue()}
                        style={{ width: "50%", marginTop: 0.1 * height }}
                        isShadow
                        title={I18n.t("AccountVerifyScreen.continue")}
                    />
                </View>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        confirmCodeReducer: state.confirmCodeReducer,
        checkPhoneReducer: state.checkPhoneReducer
    };
}
ConfirmationCode = connect(mapStateToProps)(ConfirmationCode);
export default ConfirmationCode;
