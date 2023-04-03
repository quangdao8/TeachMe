/* eslint-disable no-class-assign */
import React from "react";
import { connect } from "react-redux";
import { View, Modal, Platform } from "react-native";

import MainTab from "./MainTab";
import { types } from "actions";
import { getChatRoomDetail } from "actions/chat/chatHistoriesAction";
import { navigateTo } from "../actions/navigateAction";
const _ = require("lodash");

class MainTabContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: true
        };
    }

    componentDidUpdate(prevProps) {
        const { dispatch, drawerReducer, navigation, navigateReducer } = this.props;
        const { state } = navigation;
        // const currentRoot = state.routes[state.index];
        if (prevProps.drawerReducer != drawerReducer) {
            if (drawerReducer.drawerOpen) {
                navigation.toggleDrawer();
            }
        }
        // if (prevProps.navigateReducer !== navigateReducer) {
        //     if (navigateReducer.screen) {
        //         getChatRoomDetail(navigateReducer.roomId).then(res => {
        //             const { id } = res.response;
        //             if (res.error) {
        //             } else {
        //                 //             if (currentRoot.key == "Chat") {
        //                 this.params = {
        //                     routeName: "StackChat",
        //                     params: { id, chatRoomInfo: res.response },
        //                     key: `${id}-chat`
        //                 };
        //                 setTimeout(() => {
        //                     navigation.navigate(this.params);
        //                 }, 1000);
        //             }
        //         });
        //     }
        // }
    }

    render() {
        return (
            <View style={styles.container}>
                <MainTab />
            </View>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%"
    }
};

function mapStateToProps(state) {
    return {
        drawerReducer: state.drawerReducer,
        navigateReducer: state.navigateReducer
    };
}
MainTabContainer = connect(mapStateToProps)(MainTabContainer);
export default MainTabContainer;
