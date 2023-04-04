import React from "react";
import { View, StatusBar, FlatList, TouchableOpacity, Keyboard } from "react-native";
import { connect } from "react-redux";
import { Fab } from "native-base";
import { Colors, Const, Convert } from "helper/index";
import { types, contactAction } from "actions/index";
import { Container, AppImage, AppText } from "components/index";
import { getListFavoriteTeacherRequest } from "actions/favoriteAction";
import styles from "./styles";
import { ICON } from "assets";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import CardTeacher from "./CardTeacher";
import { FloatingAction } from "react-native-floating-action";
import firebase from "@react-native-firebase/app";

import { DEVICE, USER_TYPE } from "helper/Consts";

const _ = require("lodash");

const actions = [
    {
        text: I18n.t("teacherScreen.addAdvanced"),
        icon: ICON.SETTING,
        name: "Advancedsearch",
        position: 3,
        color: Colors.MAIN_COLOR
    },
    // {
    //     text: I18n.t("teacherScreen.addLocation"),
    //     icon: ICON.IC_LOCATION,
    //     name: "Maps",
    //     position: 2,
    //     color: Colors.MAIN_COLOR
    // },
    {
        text: I18n.t("teacherScreen.qrCode"),
        icon: ICON.IC_QRCODE,
        name: "QRScanTeacher",
        position: 1,
        color: Colors.MAIN_COLOR
    }
];
const colorActive = Colors.MAIN_COLOR;
const colorClose = Colors.MAIN_COLOR;
class ListTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            active: false,
            teacherData: [],
            backUpData: [],
            refresh: false,
            tabs: false,
            initialRender: 1,

            color: colorActive,
            keyboardHeight: 10,
            onlineStatus: []
        };
        this.valueSearch = "";
        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }
    componentWillMount() {
        const { favoriteReducer, dispatch } = this.props;
        this.onLoading();
        this.getTeacher(favoriteReducer);
    }
    componentDidMount() {
        this.onRefresh();
        this.getOnlineStatusTeacher();
    }

    componentDidUpdate(prevProps) {
        const { favoriteReducer, dispatch } = this.props;
        if (prevProps.favoriteReducer !== favoriteReducer) {
            if (favoriteReducer.type === types.POST_FAVORITE_TEACHER_SUCCESS) {
                this.onLoading();
            } else if (favoriteReducer.type === types.GET_LIST_FAVORITE_TEACHER_SUCCESS) {
                this.setState({ refresh: false }, () => {
                    this.getTeacher(favoriteReducer);
                });
            } else {
                this.setState({ refresh: false });
            }
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    getOnlineStatusTeacher() {
        const { userReducer } = this.props;

        if (userReducer.data.type == USER_TYPE.TEACHER) return;

        firebase
            .database()
            .ref(`/status/`)
            .on("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                this.setState({ onlineStatus: value });
            });
    }

    _keyboardDidShow = e => {
        this.setState({
            keyboardHeight: e.endCoordinates.height + 10 - 55
        });
    };

    _keyboardDidHide = () => {
        this.setState({ keyboardHeight: 10 });
    };

    onLoading() {
        const { dispatch, userReducer } = this.props;
        let params = {
            user__id: userReducer.data.id,
            is_liked: true
        };
        dispatch(getListFavoriteTeacherRequest(params));
    }

    onRefresh() {
        if (!_.isEmpty(this.valueSearch)) {
            this.onSearch(this.valueSearch);
        } else {
            this.setState({ refresh: true }, () => {
                this.onLoading();
            });
        }
    }

    renderItem(item) {
        let { onlineStatus } = this.state;

        let online = true;
        let status = onlineStatus.find(el => {
            return el.id == item.teacher.id;
        });
        if (!_.isEmpty(status)) {
            online = status.status;
        }

        return <CardTeacher item={item} navigation={this.props.navigation} online={online} />;
    }

    onSearch(value) {
        let { backUpData } = this.state;
        if (_.isEmpty(backUpData)) return;
        clearTimeout(this.timeout);
        this.setState({ teacherData: [], refresh: true }, () => {
            this.timeout = setTimeout(() => {
                this.valueSearch = value.trim();
                let mainData = _.filter(backUpData, function(o) {
                    const userName = o.teacher.user.first_name + " " + o.teacher.user.last_name;

                    const removeDia = Convert.removeDiacritics(userName.toLowerCase());
                    const valueRemovDia = Convert.removeDiacritics(value.toLowerCase());
                    return (
                        // _.includes(userName.toLowerCase(), value.toLowerCase()) ||
                        _.includes(removeDia, valueRemovDia)
                    );
                });
                this.setState({ teacherData: mainData, refresh: false });
                // if (value.trim()) {
                //     this.setState({ teacherData: mainData, refresh: false });
                // } else {
                //     this.valueSearch = "";
                //     this.setState({ teacherData: backUpData, refresh: false });
                // }
            }, 1500);
        });
    }

    getTeacher(favoriteReducer) {
        let listTeacher = _.filter(_.isEmpty(favoriteReducer.listData) ? [] : favoriteReducer.listData, function(o) {
            return !_.isEmpty(o.teacher) && o.teacher.type == 1;
        });
        this.setState({
            teacherData: listTeacher,
            backUpData: listTeacher
        });
    }

    renderEmptyStudent() {
        let { refresh, backUpData } = this.state;
        return (
            !refresh && (
                <AppText
                    text={_.isEmpty(backUpData) ? I18n.t("teacherScreen.emptyContact") : I18n.t("callHistory.noResult")}
                    style={styles.textEmpty}
                />
            )
        );
    }

    renderListTeacher() {
        const { initialRender, refresh, teacherData, keyboardHeight } = this.state;

        return (
            <View style={{ width: DEVICE.DEVICE_WIDTH, flex: 1 }}>
                <FlatList
                    initialNumToRender={initialRender}
                    ref={ref => (this.flatlist = ref)}
                    contentContainerStyle={{ paddingBottom: keyboardHeight }}
                    showsVerticalScrollIndicator={false}
                    data={teacherData}
                    extraData={this.state}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item, index) => `${index}`}
                    refreshing={refresh}
                    onRefresh={() => this.onRefresh()}
                    ListEmptyComponent={this.renderEmptyStudent()}
                />
            </View>
        );
    }

    renderFab() {
        const { navigation } = this.props;
        const { color } = this.state;
        return (
            <FloatingAction
                iconHeight={20}
                iconWidth={20}
                color={color}
                onOpen={() => this.setState({ color: colorClose })}
                onClose={() => this.setState({ color: colorActive })}
                actions={actions}
                onPressItem={name => {
                    navigation.navigate(name);
                }}
            />
        );
    }

    render() {
        const { navigation } = this.props;
        const { tabs } = this.state;

        return (
            <Container
                scrollEnabled={false}
                contentContainerStyle={{
                    flex: 1,
                    backgroundColor: Colors.CONTENT_COLOR,
                    alignItems: "flex-start"
                }}
            >
                {/* <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} /> */}
                <HeaderApp
                    isSearch={true}
                    onChangeText={value => this.onSearch(value)}
                    leftOnPress={() => navigation.navigate("StartLogin")}
                    navigation={navigation}
                    title={I18n.t("ListUserScreen.yoleanTeacher")}
                />

                {this.renderListTeacher()}
                {this.renderFab()}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer,
        favoriteReducer: state.favoriteReducer
    };
}
ListTeacher = connect(mapStateToProps)(ListTeacher);
export default ListTeacher;
