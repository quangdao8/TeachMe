import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { View, Modal } from "react-native";
import { HeaderApp } from "components";
import { DEVICE, DIMENSION } from "helper/Consts";
import { Spinner } from "native-base";
import { alertActions } from "actions";
import { Const } from "helper";
import I18n from "helper/locales";
import _ from "lodash";
import styles from "./styles";
import { updateAmount, loginSuccess, topUpTransaction } from "actions/userActions";
import WebView from "react-native-webview";

const SUCCESS_CODE = "00";

class Vnpay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "VNPAY",
            url: "",
            loading: true,
            money: 0,
            updating: true
        };
    }

    // updateMoney() {
    //     const { updating } = this.state;
    //     if (updating) {
    //         this.setState({ updating: false }, () => {
    //             const { userReducer, navigation, dispatch } = this.props;
    //             const money = navigation.getParam("money");
    //             const paramUpdateAmount = {
    //                 userId: userReducer.id,
    //                 money: money
    //             };
    //             topUpTransaction(paramUpdateAmount).then(res => {
    //                 if (res.error) {
    //                     let paramsAlert = {
    //                         content: I18n.t("Alert.topupError"),
    //                         title: I18n.t("Alert.notice"),
    //                         type: Const.ALERT_TYPE.ERROR
    //                     };
    //                     dispatch(alertActions.openAlert(paramsAlert));
    //                 } else {
    //                     const params = {
    //                         content: I18n.t("topUp.paymentSuccess"),
    //                         title: I18n.t("Alert.notice"),
    //                         type: Const.ALERT_TYPE.SUCCESS
    //                     };
    //                     dispatch(alertActions.openAlert(params));
    //                     const { response } = res;
    //                     const { current_amount } = response;
    //                     let userUpdate = { ...userReducer };
    //                     userUpdate.amount = current_amount;
    //                     dispatch(loginSuccess(userUpdate));
    //                 }
    //             });
    //         });
    //     }
    // }

    componentDidMount() {
        const { navigation } = this.props;
        const url = navigation.getParam("url");
        const money = navigation.getParam("money");
        setTimeout(() => {
            // this.updateMoney();
            this.setState({ url, loading: false, money });
        }, 500);
    }

    _processPage(page) {
        const { title, url } = page;
        const { dispatch, navigation, userReducer } = this.props;
        const { money } = this.state;
        // this.setState({ title });
        if (_.includes(url, "vnp_ResponseCode")) {
            if (_.includes(url, `vnp_ResponseCode=${SUCCESS_CODE}`)) {
                const params = {
                    content: I18n.t("topUp.waitForTopup"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.SUCCESS
                };
                dispatch(alertActions.openAlert(params));
                // this.updateMoney();
            } else {
                const params = {
                    content: I18n.t("topUp.paymentFailed"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(params));
            }
            navigation.goBack();
            return;
        }
    }
    _leftOnPress() {}

    renderLoading() {
        return <Spinner color="#000" />;
    }

    render() {
        const { navigation } = this.props;
        const { title, url, loading } = this.state;

        return (
            <View>
                <HeaderApp title={title} isBack navigation={navigation} />
                <View style={styles.content}>
                    {!loading && (
                        <WebView
                            style={{ width: DEVICE.DEVICE_WIDTH }}
                            renderLoading={() => this.renderLoading()}
                            scalesPageToFit
                            source={{ uri: url }}
                            onNavigationStateChange={page => this._processPage(page)}
                        />
                    )}
                    {loading && this.renderLoading()}
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer.data
    };
}

Vnpay = connect(mapStateToProps)(Vnpay);
export default Vnpay;
