import React from "react";
import { View, Alert, ImageBackground, TouchableOpacity, StatusBar, AsyncStorage, TextInput } from "react-native";
import { connect } from "react-redux";
import { Const, Colors, Validate } from "../../helper/index";
import { types, userActions } from "../../actions/index";
import { Container, Button, AppImage, Input, AppText, Picker, HeaderApp } from "../../components/index";
import styles from "./styles";
import I18n from "../../helper/locales";
import { Images, FONT_SF, ICON } from "assets";
import { changeLanguage } from "../../actions/langAction";
import { checkPhoneExist } from "../../actions/registerActions";
import { requestLogin } from "../../actions/userActions";
// import firebase from "react-native-firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const data = [{ countryCode: "VI", flag: Images.VIE }, { countryCode: "EN", flag: Images.ENG }];

class NewLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    }

    componentDidMount() { }

    componentDidUpdate(prevProps) {
        const { userReducer, navigation } = this.props;
        const { password } = this.state;
        if (prevProps.userReducer !== userReducer) {
            if (userReducer.type === types.LOGIN_SUCCESS) {
                AsyncStorage.getItem(Const.LOCAL_STORAGE.DEVICE_TOKEN).then(deviceToken => {
                    // const result = userActions.updateNotificationId({ id: userReducer.data.id, deviceToken });
                    // const notifications = firebase.notifications();
                    // notifications.setBadge(userReducer.data.badge);
                });
                if (!userReducer.data.is_verified) {
                    const params = {
                        username: userReducer.data.user.username,
                        password,
                        type: userReducer.data.type,
                    }
                    navigation.navigate("VerifyEmail", { params })
                } else if (userReducer.data.type === 1) {
                    userReducer.data && userReducer.data.active
                        ? navigation.navigate("DrawerAppTeacher")
                        : navigation.navigate("WaitForVerify");
                    // : navigation.navigate("DrawerAppTeacher");
                } else {
                    navigation.navigate("DrawerApp");
                }
                return;
            }
        }
    }

    onLogin = async () => {
        const { dispatch, navigation } = this.props;
        const { password } = this.state;
        const validPass = new Validate(I18n.t("registration.pass"), password);
        if (validPass.validatePassword()) {
            Alert.alert(I18n.t("Alert.notice"), validPass.validatePassword()[0]);
        } else {
            let params = {
                username: navigation.getParam("username"),
                password: password
            };
            dispatch(requestLogin(params));
        }
    }

    render() {
        const { navigation, dispatch, language } = this.props;
        const { password } = this.state;
        return (
            <ImageBackground
                style={{ flex: 1 }}
                source={require("../../assets/backgroundLogin.png")}
            >
                <HeaderApp
                    isBack
                    navigation={navigation}
                    transparent
                    headerContainer={{ backgroundColor: "transparent" }}
                />
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                    <AppImage
                        local
                        source={require("../../assets/logoLogin.png")}
                        resizeMode="contain"
                        style={{
                            width: "100%",
                            height: 0.15 * height,
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
                        <AppText style={{ color: "white", fontSize: 18 }} text={I18n.t("startLoginScreen.cameWith")}>
                            <AppText
                                style={{ color: "white", fontSize: 18, fontFamily: FONT_SF.BOLD }}
                                text={I18n.t("startLoginScreen.yoleanTeacher")}
                            />
                        </AppText>
                    </View>

                    {/* <Picker
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
                    /> */}
                    <View style={styles.viewGreeting} />
                    <View style={{ width: "100%", paddingHorizontal: 40, marginTop: 0.1 * height }}>
                        <View style={{ height: 50, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <AppText text={I18n.t('loginScreen.greeting') + ", "} style={styles.txtGreeting}>
                                <AppText text={navigation.getParam("name")} style={styles.txtName}/>
                            </AppText>
                        </View>
                        <TextInput
                            value={password}
                            style={styles.input}
                            onChangeText={(text) => this.setState({ password: text.trim() })}
                            placeholder={I18n.t('loginScreen.inputPass')}
                            secureTextEntry
                        />
                        <Button
                            style={{
                                width: "100%",
                                backgroundColor: Colors.WHITE_COLOR,
                                marginBottom: 0.02 * height
                            }}
                            tStyle={{ color: Colors.MAIN_COLOR, fontSize: 18 }}
                            title={I18n.t("loginScreen.login")}
                            isShadow
                            onPress={this.onLogin}
                        />
                        <TouchableOpacity
                            onPress={() => navigation.navigate("FindAccount", { username: navigation.getParam("username") })}
                            // onPress={() => { }}
                            style={{ alignItems: "center", justifyContent: "center", }}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <AppText
                                style={{ color: "white", fontSize: 16, fontFamily: FONT_SF.BOLD }}
                                text={I18n.t("startLoginScreen.forgotPassword")}
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                {/* <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <AppImage local source={ICON.BACK} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity> */}
            </ImageBackground>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        language: state.languageReducer.language
    };
}
NewLogin = connect(mapStateToProps)(NewLogin);
export default NewLogin;
