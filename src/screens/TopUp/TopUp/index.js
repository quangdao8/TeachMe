import React from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { HeaderApp, AppText, Button, AppImageCircle } from "components";
import { PD, USER_TYPE } from "helper/Consts";
import { Col, Spinner } from "native-base";
import styles from "./styles";
import I18n from "helper/locales";
import { DATA } from "./dataTopUp";
import { vnp_param, VNP_HASHSECRET, sortObject, vnp_Url } from "./function";
import { convertToQuery, sortListByField, numberToCurrency } from "helper/convertLang";
// import * as RNIap from 'react-native-iap';
import { ICON } from "assets";
import { Colors, Const, ServiceHandle } from "helper";
import ModalPaymentMethod from "./ModalPaymentMethod";
import { loginSuccess } from "actions/loginActions";
import { alertActions } from "actions";
import { topUpTransaction } from "actions/userActions";
import _ from "lodash";
import WebView from "react-native-webview";

const SANDBOX = true;
const itemSkus = Platform.select({
    ios: [
        "com.yotalk.app.22000",
        "com.yotalk.app.45000",
        "com.yotalk.app.109000",
        "com.yotalk.app.199000",
        "com.yotalk.app.299000",
        "com.yotalk.app.499000"
        // "arill.react_native.yoleaner1.22000.1",
        // "arill.react_native.yoleaner1.45000",
        // "arill.react_native.yoleaner1.109000",
        // "arill.react_native.yoleaner1.199000",
        // "arill.react_native.yoleaner1.299000",
        // "arill.react_native.yoleaner1.499000"
    ],
    android: ["com.yotalk.22000"]
});
class TopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: 0,
            openModal: false,
            products: [],
            loaded: false,
            loading: false,
            spinner: true,
            recharge: true
        };
        this.url = { uri: "https://github.com/facebook/react-native" };
    }

    async componentDidMount() {
        let products = DATA;
        this.setState({ loaded: true, products, selectedItem: products[0].price });
        // RNIap.initConnection()
        //     .then(connected => {
        //         if (connected) {
        //             RNIap.getProducts(itemSkus)
        //                 .then(async res => {
        //                     // if (Platform.OS == "android") {
        //                     //     await RNIap.consumeAllItems();
        //                     // }
        //                     // let products = await sortListByField(res, "price").reverse();
        //                     // if (_.isEmpty(products)) {
        //                     //     products = DATA;
        //                     // }
        //                     // this.setState({ products, loaded: true, selectedItem: products[0].price });
        //                 })
        //                 .catch(error => {
        //                     // products = DATA;
        //                     // this.setState({ loaded: true, products, selectedItem: products[0].price });
        //                 });
        //         }
        //     })
        //     .catch(error => {
        //         // products = DATA;
        //         // this.setState({ loaded: true, products, selectedItem: products[0].price });
        //     });
    }

    _onPressItem(item) {
        const { price, productId } = item;
        this.setState({ selectedItem: price, skuSelected: productId });
    }

    async _openVNPAY() {
        // this.setState({ openModal: true });
        const { navigation, userReducer, dispatch } = this.props;

        const { selectedItem } = this.state;
        const param = await vnp_param({ amount: selectedItem });
        const objsort = sortObject(param);
        let response = await ServiceHandle.post("/payment/", {
            id: userReducer.id.toString(),
            amount: selectedItem
        });
        if (response.error) {
            const params = {
                content: I18n.t("topUp.paymentFailed"),
                title: I18n.t("Alert.notice"),
                type: Const.ALERT_TYPE.ERROR
            };
            dispatch(alertActions.openAlert(params));
        }
        this._closeModal();

        navigation.navigate("Vnpay", { url: response.response.url, money: selectedItem });

        // const querytoSHA256 =
        //     VNP_HASHSECRET +
        //     "vnp_Amount=" +
        //     objsort.vnp_Amount +
        //     "&vnp_Command=" +
        //     objsort.vnp_Command +
        //     "&vnp_CreateDate=" +
        //     objsort.vnp_CreateDate +
        //     "&vnp_CurrCode=" +
        //     objsort.vnp_CurrCode +
        //     "&vnp_IpAddr=" +
        //     objsort.vnp_IpAddr +
        //     "&vnp_Locale=" +
        //     objsort.vnp_Locale +
        //     "&vnp_OrderInfo=" +
        //     objsort.vnp_OrderInfo +
        //     "&vnp_OrderType=" +
        //     objsort.vnp_OrderType +
        //     "&vnp_ReturnUrl=" +
        //     objsort.vnp_ReturnUrl +
        //     "&vnp_TmnCode=" +
        //     objsort.vnp_TmnCode +
        //     "&vnp_TxnRef=" +
        //     objsort.vnp_TxnRef +
        //     "&vnp_Version=" +
        //     objsort.vnp_Version;
        // sha256(querytoSHA256)
        //     .then(async secureHash => {
        //         let vnp_Params = objsort;
        //         vnp_Params["vnp_SecureHashType"] = "SHA256";
        //         vnp_Params["vnp_SecureHash"] = secureHash;
        //         let vnpUrlSend = vnp_Url;
        //         vnpUrlSend += convertToQuery(vnp_Params);
        //         this._closeModal();
        //         setTimeout(() => {
        // navigation.navigate("Vnpay", { url: vnpUrlSend, money: objsort.vnp_Amount / 100 });
        //     }, 200);
        // })
        // .catch(error => {
        //     this._closeLoading().then(() => {
        //         setTimeout(() => {
        //             this._openAlertError();
        //         }, 300);
        //     });
        // });
    }

    _openAlertSuccess() {
        const { dispatch } = this.props;
        const params = {
            content: I18n.t("topUp.paymentSuccess"),
            title: I18n.t("Alert.notice"),
            type: Const.ALERT_TYPE.SUCCESS
        };
        dispatch(alertActions.openAlert(params));
    }

    _openAlertError() {
        const { dispatch } = this.props;
        const params = {
            content: I18n.t("topUp.paymentFailed"),
            title: I18n.t("Alert.notice"),
            type: Const.ALERT_TYPE.ERROR
        };
        dispatch(alertActions.openAlert(params));
    }

    async _closeLoading() {
        await this.setState({ loading: false });
    }

    _openModal() {
        this.setState({ openModal: true });
    }

    _closeModal() {
        this.setState({ openModal: false }, () => {
            setTimeout(() => {
                this.setState({ loading: false });
            }, 100);
        });
    }

    _requestPurchase = async sku => {
        RNIap.buyProduct(sku)
            .then(response => {
                this._closeModal();
                this._updateMoney();
                // TODO: VALIDATE RECEIPT
                // if (Platform.OS === "ios") {
                //     const receiptBody = {
                //         "receipt-data": response.transactionReceipt,
                //         password: "Quangtrung1"
                //     };
                //     RNIap.validateReceiptIos(receiptBody, SANDBOX).then(response1 => {
                //         console.log("response1", response1);
                //     });
                // }
            })
            .catch(error => {
                console.warn(error.code, error.message);
                this._closeModal();
                setTimeout(() => {
                    this._openAlertError();
                }, 300);
            });
    };

    _updateMoney() {
        // this._openAlertSuccess();
        const { userReducer, navigation, dispatch } = this.props;
        const { selectedItem } = this.state;
        const money = selectedItem;
        const paramUpdateAmount = {
            userId: userReducer.id,
            money: money
        };
        topUpTransaction(paramUpdateAmount).then(res => {
            if (res.error) {
                console.log("results results", res);
            } else {
                const { response } = res;
                const { current_amount } = response;
                let userUpdate = { ...userReducer };
                userUpdate.amount = current_amount;
                dispatch(loginSuccess(userUpdate));
            }
        });
    }

    _onPressBtn(title) {
        const { skuSelected, loading } = this.state;
        this.setState({ loading: true }, () => {
            setTimeout(() => {
                switch (title) {
                    case I18n.t("topUp.vnpay"):
                        this._openVNPAY();
                        break;
                    case I18n.t("topUp.iap"):
                        this._requestPurchase(skuSelected);
                        break;
                    case I18n.t("CallScreen.cancel"):
                        this._closeModal();
                        break;
                    default:
                        break;
                }
            }, 100);
        });
    }

    renderItem(item, index) {
        const { selectedItem, loaded, products } = this.state;
        if (loaded) {
            const { price } = item;
            const isSelected = selectedItem === price;
            return (
                <Col size={3} key={index} style={styles.itemWrap}>
                    <TouchableOpacity onPress={() => this._onPressItem(item)}>
                        <View style={isSelected ? styles.innerWrap : styles.innerWrapInActive}>
                            <AppText
                                text={`${numberToCurrency(item.price)}${I18n.t("topUp.curr")}`}
                                style={isSelected ? styles.moneyText : styles.moneyTextInActive}
                            />
                            {isSelected && (
                                <AppText
                                    canPress
                                    text={I18n.t("topUp.buy").toUpperCase()}
                                    style={isSelected ? styles.moneyText : styles.moneyTextInActive}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </Col>
            );
        } else {
            return null;
        }
    }

    renderMoney() {
        const { products, loaded } = this.state;
        return (
            <View>
                <View style={{ marginVertical: PD.PADDING_6 }}>
                    <AppText text={I18n.t("topUp.title")} style={styles.titleMiddle} />
                </View>
                {!loaded ? (
                    <View>
                        <Spinner color={Colors.MAIN_COLOR} />
                    </View>
                ) : (
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            {this.renderItem(products[0])}
                            {this.renderItem(products[1])}
                            {this.renderItem(products[2])}
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            {this.renderItem(products[3])}
                            {this.renderItem(products[4])}
                            {this.renderItem(products[5])}
                        </View>
                    </View>
                )}
            </View>
        );
    }

    navigationBack() {
        const type = this.props.userReducer.type;
        const { navigation } = this.props;
        let { recharge } = this.state;
        if (!recharge) {
            this.setState({ recharge: true, spinner: true });
            return;
        }
        if (type == USER_TYPE.STUDENT) {
            navigation.navigate("MainTabContainer");
        } else {
            navigation.navigate("MainTabContainerTeacher");
        }
    }

    renderLoading() {
        return <Spinner color="#000" />;
    }

    render() {
        const { navigation } = this.props;
        const { openModal, selectedItem, loading, spinner, recharge } = this.state;
        return recharge ? (
            <View style={styles.container}>
                <HeaderApp
                    title={I18n.t("topUp.topUp")}
                    navigation={navigation}
                    leftOnPress={() => this.navigationBack()}
                    isBack
                />
                <View>
                    <View style={{ alignItems: "center", paddingTop: PD.PADDING_4 }}>
                        <AppImageCircle
                            image
                            local
                            source={ICON.IC_WALLET}
                            resizeMode="contain"
                            styleImage={{ width: 30, height: 30, borderRadius: 0 }}
                        />
                    </View>
                    {this.renderMoney()}
                    <View style={{ marginVertical: PD.PADDING_4 }}>
                        <Button
                            title={I18n.t("topUp.topUp").toUpperCase()}
                            onPress={() => this._openModal()}
                            tStyle={styles.btnStyle}
                        />
                    </View>
                    <View style={{ marginVertical: PD.PADDING_4 }}>
                        <TouchableOpacity
                            onPress={() =>
                                this.setState({ recharge: false }, () => {
                                    setTimeout(() => {
                                        this.setState({ spinner: false });
                                    }, 500);
                                })
                            }
                        >
                            <AppText text={I18n.t("topUp.findout")} style={styles.descMiddle} />
                        </TouchableOpacity>
                    </View>
                </View>
                {openModal && (
                    <ModalPaymentMethod
                        isLoading={loading}
                        isVisible={openModal}
                        price={selectedItem}
                        onPressBtn={title => this._onPressBtn(title)}
                    />
                )}
            </View>
        ) : (
            <View style={styles.container}>
                <HeaderApp
                    title={I18n.t("topUp.findout")}
                    navigation={navigation}
                    leftOnPress={() => this.navigationBack()}
                    isBack
                />
                <View style={styles.webview}>
                    {!spinner && (
                        <WebView
                            style={{ width: Const.DEVICE.DEVICE_WIDTH }}
                            renderLoading={() => this.renderLoading()}
                            scalesPageToFit
                            source={this.url}
                            onNavigationStateChange={() => {}}
                        />
                    )}
                    {spinner && this.renderLoading()}
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

TopUp = connect(mapStateToProps)(TopUp);
export default TopUp;
