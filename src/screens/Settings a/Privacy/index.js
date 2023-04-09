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
import { finderRequest } from "actions/contactActions";
import Liner from "./Components/Liner";
import { PD } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const _ = require("lodash");

class Privacy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            press: false
        };
    }

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <HeaderApp title={I18n.t("settings.privacy")} isBack navigation={navigation} />
                <ScrollView>
                    <View style={{ height: 24 }} />
                    <Liner title={I18n.t("settings.shareSeen")} isSwitch />
                    <View style={{ paddingHorizontal: PD.PADDING_4, paddingVertical: PD.PADDING_2 }}>
                        <AppText
                            text={I18n.t("settings.hideSeenStatus")}
                            style={{ color: Colors.GRAY_TEXT_COLOR, fontSize: responsiveFontSize(1.8) }}
                        />
                    </View>
                    <View style={styles.view} />
                    <Liner title={I18n.t("settings.privacyPolicy")} disabled={false} />
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer
    };
}
Privacy = connect(mapStateToProps)(Privacy);
export default Privacy;
