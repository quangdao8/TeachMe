import React from "react";
import {
    View,
    Alert,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import { connect } from "react-redux";
import { Const, Colors, Validate } from "../../helper/index";
import { types, userActions } from "../../actions/index";
import { Container, Button, AppImage, Input, AppText, Picker } from "../../components/index";
import styles from "./styles";
import I18n from "../../helper/locales";
import { Images, FONT_SF } from "../../assets";
import { changeLanguage } from "../../actions/langAction";
import { checkPhoneExist } from "../../actions/registerActions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const data = [{ countryCode: "VI", flag: Images.VIE }, { countryCode: "EN", flag: Images.ENG }];

class  StartLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "0823072824",
            password: "",
            selected: "key1",
            modalVisible: false
        };
    }

    componentDidMount() {}

    componentDidUpdate(prevProps) {
        // const { navigation, dispatch, language } = this.props;
        // I18n.locale = language;
        // const { userReducer, navigation } = this.props;
        // if (prevProps.userReducer !== userReducer) {
        //     if (userReducer.type === types.LOGIN_FAILED) {
        //         setTimeout(() => {
        //             Alert.alert("Error", userReducer.errorMessage);
        //         }, 200);
        //         return;
        //     }
        //     if (userReducer.type === types.LOGIN_SUCCESS) {
        //         this.setState({
        //             username: "",
        //             password: ""
        //         });
        //         navigation.navigate("MainTab");
        //         return;
        //     }
        // }
    }

    onLogin = async () => {
        const { dispatch, navigation } = this.props;
        const { username, password } = this.state;
        const validPhoneOrEmail = new Validate(I18n.t("registration.phoneOrEmail"), username);
        if (validPhoneOrEmail.validatePhoneNumber() && validPhoneOrEmail.validateEmail()) {
            Alert.alert(I18n.t("Alert.notice"), validPhoneOrEmail.validatePhoneNumber()[0]);
        } else {
            dispatch({ type: "REQUEST" });
            let response = await checkPhoneExist({ username: username.toLowerCase() });
            dispatch({ type: "" });
            if (response.error === true) {
                if (response.errorMessage.includes("hasn't used")) {
                    navigation.navigate("Registration", { username: username.toLowerCase() });
                } else {
                    alert("Error!");
                }
            } else {
                navigation.navigate("NewLogin", { username: username.toLowerCase(), name: response.response.name });
            }
        }
    };

    renderInputs() {
        const { username, password } = this.state;
        return <View style={styles.inputsWrap} />;
    }
    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    render() {
        const { navigation, dispatch, language } = this.props;
        const { username } = this.state;
        return (
            <>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />

                <ImageBackground
                    style={{ width: "100%", height: "100%" }}
                    source={require("../../assets/backgroundLogin.png")}
                >
                    <KeyboardAwareScrollView enableOnAndroid keyboardShouldPersistTaps="always">
                        <AppImage
                            local
                            source={require("../../assets/logoLogin.png")}
                            resizeMode="contain"
                            style={{
                                width: "100%",
                                height: 0.15 * height,
                                marginTop: 0.12 * height
                            }}
                        />
                        <AppText
                            style={{
                                color: "white",
                                fontSize: 18,
                                textAlign: "center",
                                marginTop: 0.03 * height
                            }}
                            text={I18n.t("startLoginScreen.welcome")}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <AppText
                                style={{ color: "white", fontSize: 18 }}
                                text={I18n.t("startLoginScreen.cameWith")}
                            >
                                <AppText
                                    style={{ color: "white", fontSize: 18, fontFamily: FONT_SF.BOLD }}
                                    text={I18n.t("startLoginScreen.yoleanTeacher")}
                                />
                            </AppText>
                        </View>

                        <Picker
                            {...this.props}
                            onPressItem={lang => {
                                dispatch(changeLanguage(lang));
                            }}
                            style={{ width: "26%", marginTop: 0.03 * height, height: 0.05 * height }}
                            rIconStyle={{ width: 10, height: 10 }}
                            // isShadow
                            transparent
                            data={data}
                            rightIcon={require("../../assets/icon/ic-down.png")}
                        />
                        <View style={{ width: "100%", paddingHorizontal: 40, marginTop: 0.1 * height }}>
                            <TextInput
                                value={username}
                                style={styles.input}
                                onChangeText={text => this.setState({ username: text.trim() })}
                                placeholder={I18n.t("loginScreen.phoneNumber")}
                                keyboardType="email-address"
                            />
                            <Button
                                style={{
                                    width: "100%",
                                    backgroundColor: Colors.WHITE_COLOR,
                                    marginBottom: 0.02 * height
                                }}
                                tStyle={{ color: Colors.MAIN_COLOR, fontSize: 18 }}
                                title={I18n.t("AccountVerifyScreen.continue")}
                                isShadow
                                onPress={this.onLogin}
                            />
                            <AppText text={I18n.t("startLoginScreen.note")} style={{ textAlign: "center" }} />
                            {/* <Button
                            tStyle={{ fontSize: 18 }}
                            style={{ width: "100%" }}
                            transparent
                            title={I18n.t("startLoginScreen.createAcc")}
                            // isShadow
                            onPress={() => this.props.navigation.navigate("Registration")}
                        /> */}
                        </View>
                    </KeyboardAwareScrollView>
                </ImageBackground>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        language: state.languageReducer.language
    };
}
StartLogin = connect(mapStateToProps)(StartLogin);
export default StartLogin;
