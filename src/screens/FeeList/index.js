import React from "react";
import { View, FlatList, Image, Platform, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { Colors, Const } from "helper/index";
import { Container, AppText, AppImage } from "components/index";
import styles from "./styles";
import { FONT_SF, ICON } from "assets";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import { PD, DEVICE, USER_TYPE } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { transactionFullRequest, loginSuccess } from "actions/userActions";
import { numberToCurrency } from "helper/convertLang";
import { types } from "actions";
const moment = require("moment");
import firebase from "@react-native-firebase/app";

const HEIGHT = DEVICE.DEVICE_HEIGHT * 0.13;
const WIDTH = DEVICE.DEVICE_WIDTH;
const WIDTH_M = WIDTH - PD.PADDING_4;
const OUTLINE_SIZE = WIDTH_M * 0.18;
const AVATAR_SIZE = OUTLINE_SIZE - 7;

const _ = require("lodash");

class FeeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            footer: false,
            dataTransactionsFull: []
        };
        this.firstTime = false;
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

    componentDidUpdate(prevProps) {
        const { userReducer, dispatch } = this.props;
        if (userReducer !== prevProps.userReducer) {
            // if (userReducer.type == types.CALL_HISTORY_SUCCESS || userReducer.type == types.CALL_HISTORY_REQUEST) {
            //     setTimeout(() => {
            //         this.onRefresh();
            //     }, 200);
            // }
            let { dataTransactionsFull, data } = userReducer;
            if (!_.isEmpty(dataTransactionsFull) && !this.firstTime) {
                this.firstTime = true;
                const amount = dataTransactionsFull[0].current_amount;
                data.amount = amount;
                dispatch(loginSuccess(data));
            }
            this.setState({ refreshing: false, footer: false, dataTransactionsFull });
        }
    }

    renderItem(item, index) {
        const { type } = item;
        const { data } = this.props.userReducer;
        const userId = data.id;
        switch (type) {
            case 0:
            case 3:
                const hours = moment
                    .utc(item.created_time)
                    // .local()
                    .format(`HH:mm ${I18n.t("feeList.date")} DD/MM/YYYY`);
                return (
                    <View style={styles.itemWrap}>
                        <View style={{ flex: 1 }}>
                            <Image
                                local
                                source={ICON.IC_TOPUP}
                                style={{ height: AVATAR_SIZE, width: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
                            />
                        </View>
                        <View style={{ flex: 4, flexDirection: "column", marginVertical: PD.PADDING_1 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 2 }}>
                                    <AppText
                                        text={I18n.t("feeList.topUp")}
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
                                    text={`${numberToCurrency(item.current_amount)}${I18n.t("topUp.curr")}`}
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
            case 1:
                const hour = moment
                    .utc(item.call_log.start_time)
                    .local()
                    .format(`HH:mm ${I18n.t("feeList.date")} DD/MM/YYYY`);
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
                        <View style={{ flex: 1 }}>
                            <AppImage
                                resizeMode="cover"
                                source={{ uri: avatar }}
                                style={{ height: AVATAR_SIZE, width: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
                            />
                        </View>
                        <View style={{ flex: 4, flexDirection: "column", marginVertical: PD.PADDING_1 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 2 }}>
                                    <AppText
                                        text={title}
                                        style={{
                                            fontSize: responsiveFontSize(2.75),
                                            fontFamily: FONT_SF.MEDIUM,
                                            lineHeight: responsiveFontSize(3)
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
                                            fontSize: responsiveFontSize(2),
                                            lineHeight: responsiveFontSize(2.25)
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginVertical: PD.PADDING_1 }}>
                                <AppText
                                    text={`${I18n.t("feeList.time")}`}
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
                                        lineHeight: responsiveFontSize(2.25)
                                    }}
                                    numberOfLines={1}
                                />
                            </View>
                            <View style={{ flexDirection: "row", marginVertical: PD.PADDING_1 }}>
                                <AppText
                                    text={`${I18n.t("feeList.currentAmount")}`}
                                    style={{
                                        fontSize: responsiveFontSize(2),
                                        color: Colors.GRAY_TEXT_COLOR,
                                        lineHeight: responsiveFontSize(2.25)
                                    }}
                                />
                                <AppText
                                    text={`${numberToCurrency(item.current_amount)}${I18n.t("topUp.curr")}`}
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
                break;
        }
    }

    // onNext() {
    //     const { dispatch, userReducer } = this.props;
    //     let params = { user_id: userReducer.data.id };
    //     dispatch(transactionRequest(params));
    // }

    requestTransactionFull(page) {
        const { dispatch, userReducer } = this.props;
        let params = {
            user_id: userReducer.data.id,
            type: [0, 1, 3],
            page,
            amount: true
        };
        dispatch(transactionFullRequest(params));
    }

    onRefresh() {
        const page = 1;
        this.firstTime = false;
        this.setState({ refreshing: true, page }, () => {
            this.requestTransactionFull(page);
        });
    }

    onNext() {
        const { userReducer } = this.props;
        let { page, footer } = this.state;

        if (userReducer.numberOfPage <= page || footer) return;
        page += 1;
        this.setState({ page, footer: true }, () => {
            this.requestTransactionFull(page);
        });
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
        const { dataTransactionsFull } = this.state;

        return (
            <Container
                scrollEnabled={false}
                contentContainerStyle={{
                    flex: 1,
                    backgroundColor: Colors.SKY_BLUE
                }}
            >
                <HeaderApp title={I18n.t("feeList.title")} leftOnPress={() => this.navigationBack()} isBack />
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
                            text={I18n.t("feeList.currentAmount")}
                            style={{ fontSize: responsiveFontSize(2.25) }}
                        />
                        <AppText
                            text={` ${numberToCurrency(userReducer.data.amount)}${I18n.t("topUp.curr")}`}
                            style={{
                                color: Colors.MAIN_COLOR,
                                fontFamily: FONT_SF.REGULAR,
                                fontSize: responsiveFontSize(2.25)
                            }}
                        />
                    </View>
                    {/* <Button
                        title={I18n.t("incomeHistory.withdraw")}
                        onPress={() => this.onNext()}
                        tStyle={{ fontWeight: "300", fontSize: responsiveFontSize(2) }}
                        style={{ backgroundColor: "#00aeef" }}
                    /> */}
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        keyExtractor={(item, index) => `${index}`}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        showsVerticalScrollIndicator={false}
                        data={dataTransactionsFull}
                        extraData={dataTransactionsFull}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        ListEmptyComponent={() => this.renderEmptyContainer()}
                        onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                        onEndReached={() => this.onNext()}
                        ListFooterComponent={this.renderFooterTeacher()}
                    />
                </View>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
FeeList = connect(mapStateToProps)(FeeList);
export default FeeList;
