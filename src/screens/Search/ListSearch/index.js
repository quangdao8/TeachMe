import React from "react";
import { View, StatusBar, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { List, ListItem, Left, Body, Right, Thumbnail, Fab, Spinner, Icon } from "native-base";
import { Const, Colors, Convert } from "helper/index";
import { types, localNotificationActions } from "actions/index";
import { Container, AppImage, AppText } from "components/index";
import styles from "./styles";
import { ICON, FONT_SF, Images } from "assets";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import CardTeacher from "./CardTeacher";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { getContactRequest, sendFavoriteRequest, syncContactSuccess } from "actions/contactActions";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import Contacts from "react-native-contacts";
import { PermissionsAndroid, Platform } from "react-native";
import FastImage from "react-native-fast-image";
import { nospecial, likeData } from "./data";
import { PD, DIMENSION, DEVICE, USER_TYPE } from "helper/Consts";
import { isEmptyStatement } from "@babel/types";
import { searchRequest } from "actions/userActions";
import firebase from "@react-native-firebase/app";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const _ = require("lodash");

class ListSearch extends React.Component {
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
            footer: false,
            onlineStatus: []
        };
        this.valueSearch = "";
        this.page = 1;
    }
    // UNSAFE_componentWillMount() {
    //     const { userReducer } = this.props;
    //     this.setState({
    //         teacherData: _.isNull(userReducer.dataSearch) && userReducer.dataSearch.results,
    //         backUpData: _.isNull(userReducer.dataSearch) && userReducer.dataSearch.results
    //     });
    // }

    componentDidUpdate(prevProps) {
        const { userReducer, navigation } = this.props;
        if (prevProps.userReducer !== userReducer) {
            if (userReducer.type === types.SEARCH_SUCCESS) {
                this.setState({ footer: false });
            }
        }
    }

    componentDidMount() {
        this.getOnlineStatusTeacher();
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

    renderItem(item) {
        let { onlineStatus } = this.state;
        let data = {
            id: item.id,
            nickname: item.user.first_name + " " + item.user.last_name,
            avatar: item.avatar,
            // of_user: userReducer.data.id,
            teacher: item
        };

        let online = true;
        let status = onlineStatus.find(el => {
            return el.id == item.id;
        });
        if (!_.isEmpty(status)) {
            online = status.status;
        }

        return <CardTeacher item={data} navigation={this.props.navigation} online={online} />;
    }
    renderEmptyStudent() {
        let { refresh } = this.state;
        return !refresh && <AppText text={I18n.t("ListSearch.NoTeacherFound")} style={styles.textEmpty} />;
    }

    onEndReachedTeacher() {
        const { userReducer, dispatch, navigation } = this.props;
        let max = userReducer.dataSearch ? userReducer.dataSearch.numberOfPage : 0;
        if (max <= this.page || this.state.footer) return;
        this.page = this.page + 1;
        let params = navigation.getParam("params");
        params = {
            ...params,
            page: this.page
        };

        this.setState({ footer: true }, () => {
            dispatch(searchRequest(params));
        });
    }

    renderFooterTeacher() {
        let { footer } = this.state;
        return (
            footer && (
                <View style={{ alignItems: "center", marginTop: Const.PD.PADDING_3, marginBottom: Const.PD.PADDING_1 }}>
                    <View style={{ aspectRatio: 1, borderRadius: 50 }}>
                        <ActivityIndicator size="small" color="black" />
                    </View>
                </View>
            )
        );
    }

    renderListTeacher() {
        const { initialRender, refresh, teacherData } = this.state;
        const { userReducer } = this.props;

        return (
            <View style={{ width: DEVICE.DEVICE_WIDTH, flex: 1 }}>
                <FlatList
                    initialNumToRender={initialRender}
                    ref={ref => (this.flatlist = ref)}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    data={_.isEmpty(userReducer.dataSearch.results) ? [] : userReducer.dataSearch.results}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item, index) => `${index}`}
                    ListEmptyComponent={this.renderEmptyStudent()}
                    onEndReached={() => this.onEndReachedTeacher()}
                    onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                    ListFooterComponent={this.renderFooterTeacher()}
                />
            </View>
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
                <HeaderApp title={I18n.t("ListSearch.title")} isBack navigation={this.props.navigation} />
                {this.renderListTeacher()}
            </Container>
        );
    }
}
function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer
    };
}
ListSearch = connect(mapStateToProps)(ListSearch);
export default ListSearch;
