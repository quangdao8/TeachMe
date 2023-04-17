import React from "react";
import { View, StatusBar, FlatList, Platform, Alert, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { Colors, Const } from "helper/index";
import { Container, AppImage, AppText, Button } from "components/index";
import styles from "./styles";
import { FONT_SF, ICON } from "assets";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import { PD, DEVICE, USER_TYPE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { transactionRequest } from "actions/userActions";
import { numberToCurrency } from "helper/convertLang";
import { openAlert } from "actions/alertActions";
import { types } from "actions";
import firebase from "@react-native-firebase/app";

const moment = require("moment");

const HEIGHT = DEVICE.DEVICE_HEIGHT * 0.13;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 7;

const _ = require("lodash");

class IncomeHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: false,
            refreshing: false,
            dataTransactions: [],
            footer: false,
            page: 1
        };
    }

    componentDidMount() {
        const { id } = this.props.userReducer.data;
        setTimeout(() => {
            firebase
                .database()
                .ref(`/update-call-log/${id}`)
                .on("child_added", childSnapshot => {
                    // let lastItem = childSnapshot.toJSON();
                    this.onRefresh();
                });
        }, 2000);
        this.onRefresh();
    }

    requestTransaction(page) {
        const { dispatch, userReducer } = this.props;
        let params = {
            user_id: userReducer.data.id,
            type: [2, 4],
            page,
            amount: true
        };
        dispatch(transactionRequest(params));
    }

    onRefresh() {
        const page = 1;
        this.setState({ refreshing: true, page }, () => {
            this.requestTransaction(page);
        });
    }

    onNext() {
        let { page, footer } = this.state;
        if (footer) return;
        page += 1;
        this.setState({ page, footer: true }, () => {
            this.requestTransaction(page);
        });
    }

    componentDidUpdate(prevProps) {
        const { userReducer } = this.props;
        if (userReducer !== prevProps.userReducer) {
            // if (userReducer.type == types.CALL_HISTORY_SUCCESS || userReducer.type == types.CALL_HISTORY_REQUEST) {
            //     setTimeout(() => {
            //         this.onRefresh();
            //     }, 200);
            // }
            const { dataTransactions } = userReducer;
            this.setState({ refreshing: false, dataTransactions, footer: false });
        }
    }

    renderItem(item, index) {
        switch (item.type) {
            case 4:
                const hours = moment
                    .utc(item.created_time)
                    // .local()
                    .format(`HH:mm ${I18n.t("feeList.date")} DD/MM/YYYY`);
                return (
                    <View style={styles.itemWrap}>
                        <View style={{ flex: 1 }}>
                            <AppImage
                                local
                                source={ICON.IC_TOPUP}
                                style={{ height: AVATAR_SIZE, width: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
                            />
                        </View>
                        <View style={{ flex: 4, flexDirection: "column", marginVertical: PD.PADDING_1 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 2 }}>
                                    <AppText
                                        text={I18n.t("feeList.withDraw")}
                                        style={{
                                            fontSize: responsiveFontSize(2.25),
                                            fontFamily: FONT_SF.MEDIUM,
                                            lineHeight: responsiveFontSize(2.5)
                                        }}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <AppText
                                        text={`${item.amount >= 0 ? "+" : ""}${numberToCurrency(item.amount)}${I18n.t(
                                            "topUp.curr"
                                        )}`}
                                        style={{
                                            textAlign: "right",
                                            color: Colors.MAIN_COLOR,
                                            fontSize: responsiveFontSize(2)
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginVertical: PD.PADDING_1 }}>
                                <AppText
                                    text={I18n.t("feeList.newAmount")}
                                    style={{
                                        fontSize: responsiveFontSize(2),
                                        color: Colors.GRAY_TEXT_COLOR,
                                        lineHeight: responsiveFontSize(2.25)
                                    }}
                                />
                                <AppText
                                    text={`${numberToCurrency(item.current_total_income)}${I18n.t("topUp.curr")}`}
                                    style={{
                                        fontSize: responsiveFontSize(2),
                                        marginLeft: PD.PADDING_1,
                                        lineHeight: responsiveFontSize(2.25)
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: "row", marginVertical: PD.PADDING_1 }}>
                                <AppText
                                    text={I18n.t("feeList.time")}
                                    style={{
                                        fontSize: responsiveFontSize(2),
                                        color: Colors.GRAY_TEXT_COLOR,
                                        lineHeight: responsiveFontSize(2.25)
                                    }}
                                />
                                <AppText
                                    text={hours}
                                    style={{
                                        fontSize: responsiveFontSize(2),
                                        marginLeft: PD.PADDING_1,
                                        lineHeight: responsiveFontSize(2.25)
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                );
            default:
                const { data } = this.props.userReducer;
                const userId = data.id;
                const hour = moment
                    .utc(item.call_log.start_time)
                    .local()
                    .format(`HH:mm ${I18n.t("feeList.date")} DD/MM/YYYY`);
                if (false) {
                    return null;
                } else {
                    let title = "";
                    let avatar = "";
                    const { call_log } = item;
                    if (call_log.user_call.id !== userId) {
                        title = `${call_log.user_call.user.first_name} ${call_log.user_call.user.last_name}`;
                        avatar = call_log.user_call.avatar;
                    } else {
                        title = `${call_log.user_receive.user.first_name} ${call_log.user_receive.user.last_name}`;
                        avatar = call_log.user_receive.avatar;
                    }
                    return (
                        <View style={styles.itemWrap}>
                            <View style={{ flex: 1, marginVertical: PD.PADDING_1 }}>
                                <AppImage
                                    resizeMode="cover"
                                    source={{ uri: avatar }}
                                    style={{ height: AVATAR_SIZE, width: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
                                />
                            </View>
                            <View
                                style={{
                                    flex: 4,
                                    flexDirection: "column",
                                    marginVertical: PD.PADDING_1
                                }}
                            >
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ flex: 2 }}>
                                        <AppText
                                            text={title}
                                            style={{
                                                fontSize: responsiveFontSize(2.25),
                                                fontFamily: FONT_SF.MEDIUM,
                                                lineHeight: responsiveFontSize(2.5)
                                            }}
                                            numberOfLines={1}
                                        />
                                    </View>

                                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                        <AppText
                                            text={`${item.amount >= 0 ? "+" : ""}${numberToCurrency(
                                                item.amount
                                            )}${I18n.t("topUp.curr")}`}
                                            style={{
                                                textAlign: "right",
                                                color: Colors.MAIN_COLOR,
                                                paddingRight: PD.PADDING_2,
                                                fontSize: responsiveFontSize(2),
                                                lineHeight: responsiveFontSize(2.25)
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: PD.PADDING_1 }}>
                                    <AppText
                                        text={I18n.t("feeList.time")}
                                        style={{
                                            fontSize: responsiveFontSize(2),
                                            color: Colors.GRAY_TEXT_COLOR,
                                            lineHeight: responsiveFontSize(2.25)
                                        }}
                                    />
                                    <AppText
                                        text={`${item.call_log.duration}${I18n.t("feeList.second")}`}
                                        style={{
                                            fontSize: responsiveFontSize(2),
                                            marginLeft: PD.PADDING_1,
                                            lineHeight: responsiveFontSize(2.25)
                                        }}
                                    />
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: PD.PADDING_1 }}>
                                    <AppText
                                        text={I18n.t("feeList.startTime")}
                                        style={{
                                            fontSize: responsiveFontSize(2),
                                            color: Colors.GRAY_TEXT_COLOR,
                                            lineHeight: responsiveFontSize(2.25)
                                        }}
                                    />
                                    <AppText
                                        text={hour}
                                        style={{
                                            fontSize: responsiveFontSize(2),
                                            marginLeft: PD.PADDING_1,
                                            lineHeight: responsiveFontSize(2.25)
                                        }}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: PD.PADDING_1 }}>
                                    <AppText
                                        text={I18n.t("feeList.currentAmount")}
                                        style={{
                                            fontSize: responsiveFontSize(2),
                                            color: Colors.GRAY_TEXT_COLOR,
                                            lineHeight: responsiveFontSize(2.25)
                                        }}
                                    />
                                    <AppText
                                        text={`${numberToCurrency(item.current_total_income)}${I18n.t("topUp.curr")}`}
                                        style={{
                                            fontSize: responsiveFontSize(2),
                                            marginLeft: PD.PADDING_1,
                                            lineHeight: responsiveFontSize(2.25)
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    );
                }
        }
    }

    renderEmptyContainer() {
        let { refreshing } = this.state;
        return (
            !refreshing && (
                <View style={styles.containerEmpty}>
                    <AppText text={I18n.t("feeList.emptyList")} style={styles.emptyText} />
                </View>
            )
        );
    }
    renderFooterTeacher() {
        let { footer } = this.state;
        return (
            footer && (
                <View style={{ alignItems: "center", marginTop: Const.PD.PADDING_3, marginBottom: Const.PD.PADDING_1 }}>
                    {/* <View style={{ aspectRatio: 1, borderRadius: 50 }}> */}
                    <ActivityIndicator size="small" color="black" />
                    {/* </View> */}
                </View>
            )
        );
    }
    onWithDraw() {
        const { dispatch } = this.props;
        const paramsAlert = {
            content: I18n.t("Alert.callCustomerCare"),
            title: I18n.t("Alert.notice"),
            type: Const.ALERT_TYPE.WARNING
        };
        return dispatch(openAlert(paramsAlert));
    }
    // onEndReachedTeacher(page) {
    //     const { dispatch, userReducer } = this.props;
    //     let params = {
    //         user_id: userReducer.data.id,
    //         type: 1,
    //         page
    //     };
    //     this.setState({ page: page + 1, footer: true }, () => {
    //         dispatch(transactionRequest(params));
    //     });
    // }
    renderList() {
        const { userReducer } = this.props;
        const { dataTransactions, page } = this.state;
        let max = userReducer.numberOfPageDT ? userReducer.numberOfPageDT : 0;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={dataTransactions}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    style={{ width: "100%", height: "100%" }}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    extraData={dataTransactions}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => this.renderEmptyContainer()}
                    keyExtractor={(item, index) => `${index}`}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.onRefresh()}
                    onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                    onEndReached={() => max > page && this.onNext()}
                    ListFooterComponent={this.renderFooterTeacher()}
                    // onEndReached={() => {
                    //     max > page && this.onEndReachedTeacher(page);
                    // }}
                />
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
        const { navigation, userReducer } = this.props;
        const { dataTransactions } = this.state;

        let money = _.isEmpty(dataTransactions) ? 0 : dataTransactions[0].current_total_income;
        return (
            <Container
                scrollEnabled={false}
                contentContainerStyle={{
                    flex: 1,
                    backgroundColor: Colors.CONTENT_COLOR
                }}
            >
                <HeaderApp
                    navigation={navigation}
                    title={I18n.t("incomeHistory.title")}
                    leftOnPress={() => this.navigationBack()}
                    isBack
                />
                <View
                    style={{
                        paddingVertical: PD.PADDING_2,
                        flexDirection: "row",
                        width: "100%",
                        paddingHorizontal: PD.PADDING_4,
                        borderBottomColor: "#fff",
                        borderBottomWidth: 1
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            flex: 2,
                            justifyContent: "flex-start",
                            alignItems: "center"
                        }}
                    >
                        <AppText
                            text={I18n.t("incomeHistory.overbalance")}
                            style={{ fontSize: responsiveFontSize(2.25) }}
                        />
                        <AppText
                            text={` ${numberToCurrency(money)}${I18n.t("topUp.curr")}`}
                            style={{
                                color: Colors.MAIN_COLOR,
                                fontFamily: FONT_SF.REGULAR,
                                fontSize: responsiveFontSize(2.25)
                            }}
                        />
                    </View>
                    <Button
                        title={I18n.t("incomeHistory.withdraw")}
                        onPress={() => this.onWithDraw()}
                        tStyle={{ fontWeight: "300", fontSize: responsiveFontSize(2) }}
                        style={{ backgroundColor: Colors.MAIN_COLOR }}
                    />
                </View>
                {this.renderList()}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
IncomeHistory = connect(mapStateToProps)(IncomeHistory);
export default IncomeHistory;
