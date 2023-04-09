import React from "react";
import { View, StatusBar, Alert } from "react-native";
import { HeaderImage, Button, AppText, AppSlider, Container, AppImageCircle, Input } from "components";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import { Colors, Const, Helper } from "helper";
import { ICON } from "assets";
import styles from "./styles";
import { types, alertActions } from "actions";
import { connect } from "react-redux";
import { requestResetPass } from "actions/forgotPassAction/resetPassAction";
import { DEVICE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class NewPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            phoneNumber: props.checkPhoneReducer.data.response.user.username,
            error: "",
            rePassword: "",
            focus: false
        };
        this.inputRefs = {};
    }
    onLogin() {
        const { navigation } = this.props;
        this.setState({
            error: Helper.checkValid(this.inputRefs)
        });
    }
    componentDidUpdate(prevProps) {
        const { resetPassReducer, navigation, dispatch } = this.props;

        if (prevProps.resetPassReducer !== resetPassReducer) {
            if (resetPassReducer.type === types.RESET_PASS_FAILED) {
                setTimeout(() => {
                    // Alert.alert("Error", resetPassReducer.errorMessage);
                }, 200);
                return;
            }
            if (resetPassReducer.type === types.RESET_PASS_SUCCESS) {
                setTimeout(() => {
                    navigation.popToTop();
                    const paramsAlert = {
                        content: I18n.t("Alert.resetPasswordSuccess"),
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.SUCCESS
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                }, 200);

                return;
            }
        }
    }

    onContinue() {
        let { phoneNumber, password, rePassword } = this.state;
        const { dispatch } = this.props;
        const error = Helper.checkValid(this.inputRefs);

        if (!error) {
            if (password === rePassword) {
                let params = {
                    username: phoneNumber,
                    new_password: password
                };
                dispatch(requestResetPass(params));
            } else {
                this.setState({ error: I18n.t("NewPasswordScreen.notMatch") });
            }
        } else {
            this.setState({
                error
            });
        }
    }
    onFocusChange = () => {
        this.setState({ focus: true });
    };
    onBlurChange = () => {
        this.setState({ focus: false });
    };
    render() {
        const { navigation } = this.props;
        const { phoneNumber, password, rePassword, focus } = this.state;
        return (
            <Container contentContainerStyle={{ backgroundColor: Colors.CONTENT_COLOR }}>
                <HeaderApp isBack navigation={navigation} title={I18n.t("NewPasswordScreen.newPass")} />

                <View style={{ marginTop: 0.08 * height }}>
                    <AppImageCircle
                        image
                        source={ICON.LOCK}
                        styleImage={{ width: DEVICE.DEVICE_WIDTH * 0.13, height: DEVICE.DEVICE_WIDTH * 0.13 }}
                    />
                </View>
                {/* {!focus && (
                    <View style={{ paddingTop: 0.03 * height }}>
                        <AppText
                            text={I18n.t("NewPasswordScreen.pleaseInputPass")}
                            style={{
                                fontSize: 19,
                                textAlign: "center"
                            }}
                        />
                        <AppText
                            text={I18n.t("NewPasswordScreen.forAccount")}
                            style={{
                                fontSize: 19,
                                textAlign: "center"
                            }}
                        />
                    </View>
                )} */}
                {!focus && (
                    <AppText
                        text={I18n.t("NewPasswordScreen.pleaseInputPass")}
                        style={{
                            fontSize: responsiveFontSize(2.5),
                            textAlign: "center",
                            justifyContent: "center",
                            lineHeight: responsiveFontSize(3.5)
                        }}
                    />
                )}
                <View style={styles.inputsWrap}>
                    <Input
                        leftIcon
                        secureTextEntry={true}
                        inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                        nameValue={I18n.t("NewPasswordScreen.password")}
                        type={Const.INPUT_TYPE.PASSWORD}
                        onRef={ref => (this.inputRefs["password"] = ref)}
                        clearButton
                        placeholder={I18n.t("NewPasswordScreen.password")}
                        placeholderTextColor={Colors.DIABLED_BUTTON}
                        lSource={ICON.CLOCK}
                        lStyle={{ width: 0.025 * height, height: 0.025 * height }}
                        lBlurSource={ICON.PHONE_WHITE}
                        onChangeText={e => this.setState({ password: e.trim() })}
                        value={password}
                        containerStyles={{ width: "100%" }}
                        onFocus={this.onFocusChange}
                        onBlur={this.onBlurChange}
                    />
                    <Input
                        leftIcon
                        secureTextEntry={true}
                        inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                        nameValue={I18n.t("NewPasswordScreen.password")}
                        type={Const.INPUT_TYPE.PASSWORD}
                        onRef={ref => (this.inputRefs["password"] = ref)}
                        clearButton
                        placeholder={I18n.t("NewPasswordScreen.reEnterPassword")}
                        placeholderTextColor={Colors.DIABLED_BUTTON}
                        lSource={ICON.CLOCK}
                        lStyle={{ width: 0.025 * height, height: 0.025 * height }}
                        lBlurSource={ICON.PHONE_WHITE}
                        onChangeText={e => this.setState({ rePassword: e.trim() })}
                        value={rePassword}
                        containerStyles={{ width: "100%", marginTop: 0.02 * height }}
                        onFocus={this.onFocusChange}
                        onBlur={this.onBlurChange}
                    />
                    <View style={{ height: 50, justifyContent: "center" }}>
                        <AppText
                            style={{
                                color: "red",
                                textAlign: "center",
                                fontSize: responsiveFontSize(2)
                                // marginVertical: 0.03 * height,
                                // lineHeight: responsiveFontSize(2)
                            }}
                            text={this.state.error}
                        />
                    </View>
                    <Button
                        tStyle={{ fontSize: responsiveFontSize(2), lineHeight: responsiveFontSize(3) }}
                        onPress={() => this.onContinue()}
                        isShadow
                        title={I18n.t("FindAccountScreen.continue")}
                    />
                </View>
            </Container>
        );
    }
}
function mapStateToProps(state) {
    return {
        resetPassReducer: state.resetPassReducer,
        checkPhoneReducer: state.checkPhoneReducer
    };
}
NewPassword = connect(mapStateToProps)(NewPassword);

export default NewPassword;
