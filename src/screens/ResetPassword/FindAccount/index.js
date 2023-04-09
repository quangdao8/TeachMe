import React from "react";
import { View, StatusBar, Alert, TouchableOpacity, TextInput } from "react-native";
import { connect } from "react-redux";
import { HeaderImage, Button, AppText, AppSlider, Container, AppImageCircle, Input } from "components";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import { Colors, Const, Helper, Validate } from "helper";
import { ICON } from "assets";
import styles from "./styles";
import { types } from "actions";
import { requestCheckPhone } from "actions/forgotPassAction/checkPhoneAction";
import { DIMENSION } from "helper/Consts";
import CountryPicker from "react-native-country-picker-modal";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class FindAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: props.navigation.getParam("username") || "",
            error: "",
            cca2: "VN",
            check: null,
            callingCode: "84",
            name: "Vietnam",
            focus: false,
            countryPickerVisible: false
        };
        this.inputRefs = {};
    }

    componentDidUpdate(prevProps) {
        let { cca2, callingCode } = this.state;
        const { checkPhoneReducer, navigation } = this.props;
        if (prevProps.checkPhoneReducer !== checkPhoneReducer) {
            if (checkPhoneReducer.type === types.CHECK_PHONE_FAILED) {
                setTimeout(() => {
                    // Alert.alert("Error", checkPhoneReducer.errorMessage);
                }, 100);
                return;
            }
            if (checkPhoneReducer.type === types.CHECK_PHONE_SUCCESS) {
                navigation.navigate("AccountVerify", { item: { cca2, callingCode } });
                return;
            }
        }
    }

    convertPhoneNumber() {
        let { phoneNumber, callingCode } = this.state;

        let phone = "";
        let first = phoneNumber.slice(0, 1);
        if (first == "0") {
            phone = callingCode + phoneNumber.slice(1, phoneNumber.length);
        } else {
            phone = callingCode + phoneNumber;
        }
        if (callingCode == 84) {
            phone = "0" + phone.slice(2, phone.length);
        }

        return phone == "0" ? "" : phone;
    }

    onContinue = () => {
        let { phoneNumber } = this.state;
        const { dispatch } = this.props;
        const validPhoneOrEmail = new Validate(I18n.t("registration.phoneOrEmail"), phoneNumber);
        if (validPhoneOrEmail.validatePhoneNumber() && validPhoneOrEmail.validateEmail()) {
            Alert.alert(I18n.t("Alert.notice"), validPhoneOrEmail.validatePhoneNumber()[0]);
        } else {
            this.setState({
                error: ""
            });
            let params = {
                username: phoneNumber
            };
            dispatch(requestCheckPhone(params));
        }
    }
    onFocusChange = () => {
        this.setState({ focus: true });
    };
    onBlurChange = () => {
        this.setState({ focus: false });
    };
    setValue(type) {
        this.setState({ callingCode: type.callingCode, cca2: type.cca2, name: type.name, check: 1 });
    }
    onOpen = () => {
        this.setState({ countryPickerVisible: true });
    };
    onClose = () => {
        this.setState({ countryPickerVisible: false });
    };
    render() {
        const { navigation } = this.props;
        const { phoneNumber, callingCode, name, cca2, countryPickerVisible } = this.state;
        return (
            <Container contentContainerStyle={{ backgroundColor: Colors.CONTENT_COLOR }} scrollEnabled={false}>
                <HeaderApp leftIcon isBack navigation={navigation} title={I18n.t("FindAccountScreen.FindAccount")} />
                {!this.state.focus && (
                    <AppText
                        text={I18n.t("FindAccountScreen.Import")}
                        style={{
                            paddingTop: 0.05 * height,
                            fontSize: 19,
                            marginHorizontal: 50,
                            textAlign: "center",
                            lineHeight: 25
                        }}
                        numberOfLines={2}
                    />
                )}
                <View style={{ marginTop: 0.05 * height }}>
                    <AppImageCircle
                        image
                        local
                        // resizeMode="repeat"
                        source={ICON.USER}
                        styleImage={{ width: DIMENSION.H3 * 0.5, height: DIMENSION.H3 * 0.5, borderRadius: 0 }}
                    />
                </View>
                <View style={styles.inputsWrap}>
                    {/* <TouchableOpacity style={styles.dropdown} onPress={this.onOpen}>
                        <View style={{ justifyContent: "center", marginBottom: 5 }}>
                            <CountryPicker
                                countryCodes
                                withFilter
                                withCallingCode
                                withAlphaFilter
                                visible={countryPickerVisible}
                                onSelect={value => this.setValue(value)}
                                countryCode={cca2}
                                translation="eng"
                                closeable={true}
                                filterable={true}
                                onOpen={this.onOpen}
                                onClose={this.onClose}
                            />
                        </View>

                        <View
                            style={{
                                flex: 3,
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row"
                            }}
                        >
                            <AppText
                                text={`${`(+`} ${callingCode} ${`)`}`}
                                style={{ fontSize: responsiveFontSize(2.0), alignItems: "center" }}
                            />
                            <AppText
                                text={name}
                                numberOfLines={1}
                                style={{
                                    fontSize: responsiveFontSize(2.0),
                                    alignItems: "center",
                                    marginLeft: 10
                                }}
                            />
                        </View>
                    </TouchableOpacity> */}
                    {/* <Input
                        // leftIcon
                        // maxLength={15}
                        inputStyle={{ fontSize: 20 }}
                        // keyboardType="numeric"
                        nameValue={I18n.t("phoneNumber")}
                        type={Const.INPUT_TYPE.PHONE_NUMBER}
                        onRef={ref => (this.inputRefs["phone"] = ref)}
                        clearButton
                        placeholder={I18n.t("loginScreen.phoneNumber")}
                        placeholderTextColor={Colors.DIABLED_BUTTON}
                        lSource={ICON.PHONE_BLUE}
                        lStyle={{ width: 0.03 * height, height: 0.025 * height }}
                        lBlurSource={ICON.PHONE_WHITE}
                        onChangeText={e => this.setState({ phoneNumber: e.trim() })}
                        value={phoneNumber}
                        containerStyles={{ width: "100%" }}
                        onFocus={this.onFocusChange}
                        onBlur={this.onBlurChange}
                        onClear={() => this.setState({ phoneNumber: "" })}
                    /> */}
                    <TextInput
                        value={phoneNumber}
                        style={styles.input}
                        onChangeText={(text) => this.setState({ phoneNumber: text.trim() })}
                        placeholder={I18n.t('loginScreen.phoneNumber')}
                        keyboardType="email-address"
                    />
                    <AppText
                        style={{
                            fontSize: responsiveFontSize(2.0),
                            color: "red",
                            marginVertical: 0.03 * height,
                            textAlign: "center"
                        }}
                        text={this.state.error}
                    />
                    <Button
                        tStyle={{ fontSize: responsiveFontSize(2.5) }}
                        onPress={this.onContinue}
                        style={{ width: "50%" }}
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
        checkPhoneReducer: state.checkPhoneReducer
    };
}
FindAccount = connect(mapStateToProps)(FindAccount);
export default FindAccount;
