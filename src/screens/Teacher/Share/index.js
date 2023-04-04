import React from "react";
import { View, StatusBar, FlatList, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { List, ListItem, Left, Body, Right, Thumbnail, Fab, Spinner } from "native-base";
import { Const, Colors, Convert } from "helper";
import { types, localNotificationActions } from "actions";
import { Container, AppImage, AppText } from "components";
import styles from "./styles";
import { ICON, FONT_SF, Images } from "assets";
import I18n from "helper/locales";
import HeaderApp from "components/Header";

import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { getContactRequest, sendFavoriteRequest, syncContactSuccess } from "actions/contactActions";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import Contacts from "react-native-contacts";
import { PermissionsAndroid, Platform } from "react-native";

import { PD, DIMENSION, DEVICE } from "helper/Consts";

import ShareContact from "./ShareContact";
import ShareRecently from "./ShareRecently";
import ShareGroup from "./ShareGroup";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const _ = require("lodash");

class Share extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            userName: "",
            error: "",
            active: false,
            loading: false,
            groupData: [],
            favoriteData: [],
            backupData: [],
            refresh: false,
            tabs: false,
            initialRender: 1,
            // isActive: true,
            id: I18n.t("tabbar.recently"),
            valueSearch: "",
            onTab: true
        };
        this.inputRefs = {};
        this.deviceContact = [];
    }

    componentDidMount() {}

    componentDidUpdate(prevProps) {}

    renderTabbar(onPressTab, source, tabName) {
        // const { isActive } = this.state;
        const { id } = this.state;
        return (
            <TouchableOpacity
                style={[styles.regularTab, { backgroundColor: tabName == id ? "#C4681B" : Colors.MAIN_COLOR }]}
                onPress={() => onPressTab()}
            >
                <AppImage local style={{ width: 20, height: 20 }} resizeMode="contain" source={source} />
                <AppText style={styles.tabTitle} text={tabName.toUpperCase()} />
            </TouchableOpacity>
        );
    }

    renderComponent() {
        let { id } = this.state;
        switch (id) {
            case I18n.t("tabbar.recently"):
                return <ShareRecently {...this.props} search={this.state.valueSearch} />;
            case I18n.t("tabbar.contactNumber"):
                return <ShareContact {...this.props} search={this.state.valueSearch} />;
            case I18n.t("tabbar.groupChat"):
                return <ShareGroup {...this.props} search={this.state.valueSearch} />;
            default:
                return <ShareRecently {...this.props} search={this.state.valueSearch} />;
        }
    }

    changeTab(text) {
        this.setState({ id: text, onTab: false, valueSearch: "" });
    }

    render() {
        const { navigation } = this.props;
        const { id, onTab } = this.state;

        return (
            <Container
                scrollEnabled={false}
                contentContainerStyle={{
                    flex: 1,
                    backgroundColor: Colors.CONTENT_COLOR,
                    alignItems: "flex-start"
                }}
            >
                <HeaderApp
                    changeTab={true}
                    isSearch={onTab}
                    title={I18n.t("shareScreen.share")}
                    navigation={navigation}
                    onChangeText={value => this.setState({ valueSearch: value })}
                    isBack
                    rightOnPress={() => this.setState({ onTab: true })}
                />
                {this.renderComponent()}
                <View style={styles.containerTabbar}>
                    {this.renderTabbar(
                        () => this.changeTab(I18n.t("tabbar.recently")),
                        ICON.RECENTLY_ACTIVE,
                        I18n.t("tabbar.recently")
                    )}
                    {this.renderTabbar(
                        () => this.changeTab(I18n.t("tabbar.contactNumber")),
                        ICON.contact_active,
                        I18n.t("tabbar.contactNumber")
                    )}
                    {this.renderTabbar(
                        () => this.changeTab(I18n.t("tabbar.groupChat")),
                        ICON.GROUP_ACTIVE,
                        I18n.t("tabbar.groupChat")
                    )}
                </View>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
Share = connect(mapStateToProps)(Share);
export default Share;
