import React from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Const, Colors } from "helper";
import { types, alertActions } from "actions";
import { AppText, Container, Button, AppImage, Input } from "components";
import styles from "./styles";
import I18n from "helper/locales";
import { ICON } from "assets";
import HeaderApp from "components/Header";
import Liner from "./Components/Liner";
import {
    switchMessageNoti,
    switchGroupNoti,
    switchVibration,
    switchSound,
    switchSoundCall,
    switchVibrationCall
} from "actions/settingActions";

const _ = require("lodash");

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            press: false
        };
    }

    render() {
        const { navigation, dispatch, settingReducer } = this.props;
        return (
            <View style={styles.container}>
                <HeaderApp title={I18n.t("settings.notification")} isBack navigation={navigation} />
                <ScrollView>
                    <View style={{ height: 24 }} />
                    <Liner
                        title={I18n.t("settings.showNotiMessage")}
                        isSwitch
                        initSwitch={settingReducer.data.messageNoti}
                        onValueChange={valueSwitch => dispatch(switchMessageNoti(valueSwitch))}
                    />
                    <Liner
                        title={I18n.t("settings.showNotiGroup")}
                        isSwitch
                        initSwitch={settingReducer.data.groupNoti}
                        onValueChange={valueSwitch => dispatch(switchGroupNoti(valueSwitch))}
                    />
                    {/* <Liner title={I18n.t("settings.showPreMessage")} isSwitch /> */}
                    <View style={styles.view}>
                        <AppText text={I18n.t("settings.sound")} style={styles.text} />
                    </View>
                    <Liner
                        title={I18n.t("settings.message")}
                        isSwitch
                        initSwitch={settingReducer.data.sound}
                        onValueChange={valueSwitch => dispatch(switchSound(valueSwitch))}
                    />
                    {/* <Liner
                        title={I18n.t("settings.call")}
                        isSwitch
                        initSwitch={settingReducer.data.soundCall}
                        onValueChange={valueSwitch => dispatch(switchSoundCall(valueSwitch))}
                    /> */}
                    <View style={styles.view}>
                        <AppText text={I18n.t("settings.vibrate")} style={styles.text} />
                    </View>
                    <Liner
                        title={I18n.t("settings.message")}
                        isSwitch
                        initSwitch={settingReducer.data.vibration}
                        onValueChange={valueSwitch => dispatch(switchVibration(valueSwitch))}
                    />
                    {/* <Liner
                        title={I18n.t("settings.call")}
                        isSwitch
                        initSwitch={settingReducer.data.vibrationCall}
                        onValueChange={valueSwitch => dispatch(switchVibrationCall(valueSwitch))}
                    /> */}
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer,
        settingReducer: state.settingReducer
    };
}
Notification = connect(mapStateToProps)(Notification);
export default Notification;
