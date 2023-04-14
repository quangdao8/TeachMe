import React from "react";
import { View, Platform } from "react-native";
import Modal from "react-native-modal";
import { isIphoneX } from "react-native-iphone-x-helper";
import { AppText, Button } from "components";
import { Colors } from "helper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { PD } from "helper/Consts";
import I18n from "helper/locales";
import { FONT_SF } from "assets";
import { numberToCurrency } from "helper/convertLang";
import { Spinner } from "native-base";

class ModalPaymentMethod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderBtn(title) {
        const { onPressBtn = () => {} } = this.props;
        const isCancel = title == I18n.t("CallScreen.cancel");
        return (
            <View style={styles.btnWrap}>
                <Button
                    onPress={() => onPressBtn(title)}
                    title={title.toUpperCase()}
                    tStyle={styles.btnPayment}
                    style={isCancel ? { backgroundColor: Colors.RED_COLOR } : {}}
                />
            </View>
        );
    }

    render() {
        const { isVisible, price, isLoading = false } = this.props;
        return (
            <Modal isVisible={isVisible} style={styles.bottomModal}>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <View style={styles.bottomWrap}>
                        <View style={styles.titleWrap}>
                            <AppText text={I18n.t("topUp.paymentMethod").toUpperCase()} style={styles.title} />
                        </View>
                        <View style={styles.titleWrap}>
                            <AppText
                                text={`${I18n.t("topUp.desPaymentModal1")} ${numberToCurrency(price)}${I18n.t(
                                    "topUp.curr"
                                )} ${I18n.t("topUp.desPaymentModal2")}`}
                                style={styles.description}
                            />
                        </View>
                        {this.renderBtn(I18n.t("topUp.directPayment"))}
                        {this.renderBtn(I18n.t("topUp.vnpay"))}
                        {/* {Platform.OS == "ios" && this.renderBtn(I18n.t("topUp.iap"))} */}
                        {this.renderBtn(I18n.t("CallScreen.cancel"))}
                    </View>
                )}
            </Modal>
        );
    }
}

export default ModalPaymentMethod;

const styles = {
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0,
        paddingBottom: isIphoneX() ? 35 : 0
    },
    bottomWrap: {
        backgroundColor: Colors.WHITE_COLOR,
        paddingVertical: PD.PADDING_6,
        borderRadius: PD.PADDING_4
    },
    btnWrap: {
        paddingBottom: PD.PADDING_3
    },
    btnPayment: {
        fontSize: responsiveFontSize(2),
        width: "80%"
    },
    titleWrap: {
        paddingBottom: PD.PADDING_3
    },
    title: {
        textAlign: "center",
        fontSize: responsiveFontSize(2.5),
        lineHeight: responsiveFontSize(2.75),
        fontFamily: FONT_SF.SEMIBOLD
    },
    description: {
        textAlign: "center",
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveFontSize(2.5)
    }
};
