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
                        text={"Bạn vui lòng liên hệ với bộ phận admin để lấy lại mật khẩu"}
                        style={{
                            paddingTop: 0.05 * height,
                            fontSize: 19,
                            marginHorizontal: 50,
                            textAlign: "center",
                            lineHeight: 25,
                            marginTop: 50
                        }}
                        numberOfLines={2}
                    />
                )}

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
