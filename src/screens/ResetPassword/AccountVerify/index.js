import React from "react";
import { View, StatusBar, Alert, Platform } from "react-native";
import { HeaderImage, Button, AppText, AppSlider, Container, AppImage } from "components";
import { Colors, GlobalStyles, Const, Helper } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import I18n from "helper/locales";
import styles from "./styles";
import { connect } from "react-redux";
import { ICON } from "assets";
import { requestRequestCode } from "actions/forgotPassAction/requestCodeAction";
import { types, alertActions } from "actions";
import { openAccountKit } from "helper/helper";
// import RNAccountKit, { LoginButton, Color, StatusBarStyle } from "react-native-facebook-account-kit";
import { VERIFY_TYPE } from "helper/Consts";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class AccountVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check: true,
            callingCode: props.navigation.getParam("item").callingCode,
            cca2: props.navigation.getParam("item").cca2,
            phone: props.checkPhoneReducer.data.response.user.username,
            lastName: props.checkPhoneReducer.data.response.user.last_name,
            firstName: props.checkPhoneReducer.data.response.user.first_name,
            avatarSource: props.checkPhoneReducer.data.response.avatar
        };
    }

    onCheck() {
        this.setState({
            check: !this.state.check
        });
    }

    onBackPress() {
        this.props.navigation.goBack();
    }

    customButton(title = "", isChoice, onPress = () => {}) {
        const { check } = this.state;
        return (
            <Button
                renderLeftIcon={
                    <AppImage
                        source={isChoice ? ICON.CHECKED : ICON.NOT_CHECKED}
                        style={{ width: responsiveFontSize(3), height: responsiveFontSize(3) }}
                    />
                }
                tStyle={{
                    fontSize: responsiveFontSize(2.1),
                    color: isChoice ? Colors.BLACK_TEXT_COLOR : Colors.GRAY_TEXT_COLOR,
                    fontWeight: "normal",
                    flex: 4
                }}
                onPress={() => this.onCheck()}
                style={{ width: "100%", backgroundColor: Colors.WHITE_COLOR, marginBottom: 0.03 * height }}
                isShadow
                title={title}
                renderRightIcon={<View />}
                rIconStyle={{ flex: 1 }}
                lIconStyle={{ flex: 1 }}
                disabled={check}
            />
        );
    }

    convertPhoneNumber() {
        let { callingCode } = this.state;

        let phone = this.convertPhoneRegister();

        let first = phone.slice(0, 1);
        if (first == "0") {
            return Platform.OS == "android" ? "84" + phone.slice(1, phone.length) : phone.slice(1, phone.length);
        } else {
            return Platform.OS == "android" ? phone : phone.slice(callingCode.length, phone.length);
        }
    }

    convertPhoneRegister() {
        let { phone, callingCode } = this.state;

        let phoneNumber = "";
        let first = phone.slice(0, 1);
        if (first == "0") {
            phoneNumber = callingCode + phone.slice(1, phone.length);
        } else {
            phoneNumber = callingCode + phone;
        }
        if (callingCode == "84") {
            phoneNumber = "0" + phoneNumber.slice(2, phoneNumber.length);
        }

        return phoneNumber;
    }

    onPressNext() {
        const { dispatch } = this.props;
        const { check, cca2, phone } = this.state;
        // const res = phoneNumber.substring(1, 20);
        // const phoneCode = callingCode + res;
        let params = {
            username: phone,
            type: VERIFY_TYPE.RESET
        };
        let item = {
            type: check ? "email" : "phone"
        };

        // if (item.type == "email") {
        dispatch(requestRequestCode(params));
        // } else {
        /**
         * by pass check phone number
         */
        // this.nextStep()
        /**
         * check phone number by account kit
         */
        // openAccountKit(
        //     this.convertPhoneNumber(),
        //     cca2,
        //     token => this.accountKitOnSuccess(token),
        //     error => this.accountKitOnError(error)
        // );
        // }
        // dispatch(requestRequestCode(params));
    }

    nextStep() {
        const { navigation } = this.props;
        // if (phone == this.convertPhoneRegister()) {
        navigation.navigate("NewPassword");
        // } else {
        //     let paramsAlert = {
        //         content: I18n.t("Alert.notMatchPhoneNumber"),
        //         title: I18n.t("Alert.notice"),
        //         type: Const.ALERT_TYPE.ERROR
        //     };
        //     dispatch(alertActions.openAlert(paramsAlert));
        // }
    }

    async accountKitOnSuccess(token) {
        const { navigation, dispatch } = this.props;
        // let account = await RNAccountKit.getCurrentAccount();
        // let { countryCode, number } = account.phoneNumber;
        let countryCode = ''
        let number = ''
        let phone = countryCode + number;
        if (countryCode == "84") phone = "0" + number;
        if (phone == this.convertPhoneRegister()) {
            navigation.navigate("NewPassword");
        } else {
            let paramsAlert = {
                content: I18n.t("Alert.notMatchPhoneNumber"),
                title: I18n.t("Alert.notice"),
                type: Const.ALERT_TYPE.ERROR
            };
            dispatch(alertActions.openAlert(paramsAlert));
        }
    }

    accountKitOnError(error) {
        console.log("accountKitOnError", error);
    }

    componentDidUpdate(prevProps) {
        const { requestCodeReducer, navigation } = this.props;
        if (prevProps.requestCodeReducer !== requestCodeReducer) {
            if (requestCodeReducer.type === types.REQUEST_CODE_FAILED) {
                setTimeout(() => {
                    // Alert.alert("Error", requestCodeReducer.errorMessage);
                }, 200);
                return;
            }
            if (requestCodeReducer.type === types.REQUEST_CODE_SUCCESS) {
                let { check } = this.state;
                let item = {
                    type: check ? "email" : "phone"
                };
                // if (item.type == "email") {
                //     navigation.navigate("ConfirmationCode", { item });
                // } else {
                //     openAccountKit(
                //         phoneCode,
                //         token => this.accountKitOnSuccess(token),
                //         error => this.accountKitOnError(error)
                //     );
                // }
                navigation.navigate("ConfirmationCode", { item });
            }
        }
    }

    render() {
        const { navigation } = this.props;
        const { firstName, lastName, avatarSource } = this.state;
        return (
            <Container contentContainerStyle={{ backgroundColor: Colors.CONTENT_COLOR }}>
                {/* <StatusBar backgroundColor={Colors.STATUSBAR} barStyle="light-content" translucent={true} /> */}
                <HeaderImage
                    bgSource={avatarSource ? { uri: avatarSource } : ICON.USER}
                    avatarSource={avatarSource ? { uri: avatarSource } : ICON.USER}
                    containerStyle={{ height: 0.45 * height }}
                    gradientStyle={{ height: 0.45 * height }}
                    title={I18n.t("AccountVerifyScreen.confirm")}
                    nameStyle={{ fontSize: responsiveFontSize(3) }}
                    onBackPress={() => this.onBackPress()}
                    name={firstName + " " + lastName}
                    description={I18n.t("AccountVerifyScreen.userYolearn")}
                />
                <View style={styles.inputsWrap}>
                    {/* {this.customButton(I18n.t("AccountVerifyScreen.confirmPhone"), !this.state.check)}
                    {this.customButton(I18n.t("AccountVerifyScreen.confirmEmail"), this.state.check)} */}
                    <Button
                        tStyle={{ fontSize: responsiveFontSize(2.3) }}
                        onPress={() => this.onPressNext()}
                        style={{ marginTop: 0.05 * height }}
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
        requestCodeReducer: state.requestCodeReducer,
        checkPhoneReducer: state.checkPhoneReducer
    };
}
AccountVerify = connect(mapStateToProps)(AccountVerify);
export default AccountVerify;
