import React from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Colors } from "helper/index";
import { Container, AppImage, AppText, AppImageCircle } from "components/index";
import styles from "./styles";
import { ICON, FONT_SF } from "assets";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import { PD, DEVICE, VERSION, LANGUAGE_ENGLISH, LANGUAGE_VIETNAM, USER_TYPE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { changeLanguage } from "actions/langAction";

const HEIGHT = DEVICE.DEVICE_HEIGHT * 0.13;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 7;

const _ = require("lodash");

class MainSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            i18n: I18n
        };
    }

    renderItem(img, text, navigate) {
        return (
            <TouchableOpacity style={styles.wrapLang} onPress={() => this.props.navigation.navigate(navigate)}>
                <AppImage local source={img} style={{ height: 30, width: 30, alignSelf: "center" }} />
                <AppText
                    text={text}
                    style={{
                        marginLeft: PD.PADDING_4,
                        fontSize: responsiveFontSize(2.1)
                    }}
                />
            </TouchableOpacity>
        );
    }

    changeLanguage(lang) {
        let { dispatch } = this.props;
        const language = lang;
        dispatch(changeLanguage(language));
    }

    renderLanguage() {
        let { i18n } = this.state;
        const { navigation, languageReducer } = this.props;

        return (
            <View style={styles.wrapLang}>
                <AppImage local source={ICON.IC_LANGUAGE} style={{ height: 30, width: 30, alignSelf: "center" }} />
                <AppText text={I18n.t("settings.lang")} style={styles.language} />
                <View style={styles.btnWrap}>
                    <TouchableOpacity
                        onPress={() => this.changeLanguage(LANGUAGE_VIETNAM)}
                        style={[
                            styles.btn,
                            {
                                backgroundColor:
                                    languageReducer == LANGUAGE_VIETNAM ? Colors.MAIN_COLOR : Colors.WHITE_COLOR
                            }
                        ]}
                    >
                        <AppText
                            text={LANGUAGE_VIETNAM.toUpperCase()}
                            style={{
                                fontSize: responsiveFontSize(1.75),
                                fontFamily: FONT_SF.MEDIUM,
                                color:
                                    languageReducer == LANGUAGE_VIETNAM ? Colors.WHITE_COLOR : Colors.BLACK_TEXT_COLOR
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeLanguage(LANGUAGE_ENGLISH)}
                        style={[
                            styles.btn,
                            {
                                backgroundColor:
                                    languageReducer == LANGUAGE_ENGLISH ? Colors.MAIN_COLOR : Colors.WHITE_COLOR
                            }
                        ]}
                    >
                        <AppText
                            text={LANGUAGE_ENGLISH.toUpperCase()}
                            style={{
                                fontSize: responsiveFontSize(1.75),
                                fontFamily: FONT_SF.MEDIUM,
                                color:
                                    languageReducer == LANGUAGE_ENGLISH ? Colors.WHITE_COLOR : Colors.BLACK_TEXT_COLOR
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    navigationBack() {
        const type = this.props.userReducer.data.type;
        const { navigation } = this.props;
        if (type == USER_TYPE.STUDENT) {
            navigation.navigate("MainTabContainer");
        } else {
            navigation.navigate("MainTabContainerTeacher");
        }
    }

    render() {
        const { navigation, languageReducer } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.SKY_BLUE }}>
                <HeaderApp
                    title={I18n.t("settings.setting")}
                    navigation={navigation}
                    leftOnPress={() => this.navigationBack()}
                    isBack
                />
                <Container showsVerticalScrollIndicator={false} scrollEnabled={true}>
                    <View style={{ alignItems: "center", paddingTop: PD.PADDING_4 }}>
                        <AppImageCircle
                            image
                            source={ICON.IC_SETTINGS}
                            resizeMode="contain"
                            styleImage={{ width: 30, height: 30, borderRadius: 0 }}
                        />
                    </View>

                    {this.renderLanguage()}
                    {/* {this.renderItem(ICON.IC_REMOVE, "Xóa lịch sử tin nhắn", "")}
                    {this.renderItem(ICON.IC_REMOVE, "Gửi log chạy của ứng dụng", "")} */}
                    {this.renderItem(ICON.IC_SETTINGS, I18n.t("settings.notificationsAndSounds"), "Notification")}
                    {this.renderItem(ICON.IC_SECURITY, I18n.t("settings.securityAndPrivacy"), "Privacy")}
                    {this.renderItem(ICON.IC_ASK, I18n.t("settings.help"), "FrequentQuestions")}
                    <View style={styles.wrapLang}>
                        <AppImage local source={ICON.IC_ABOUT} style={{ height: 30, width: 30, alignSelf: "center" }} />
                        <AppText text={I18n.t("settings.version")} style={styles.version} />
                        <AppText text={VERSION} style={styles.verText} />
                    </View>
                </Container>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        languageReducer: state.languageReducer.language
    };
}
MainSetting = connect(mapStateToProps)(MainSetting);
export default MainSetting;
