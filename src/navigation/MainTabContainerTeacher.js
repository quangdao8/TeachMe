/* eslint-disable no-class-assign */
import React from "react";
import { connect } from "react-redux";
import { View, Modal, Platform } from "react-native";

import { types } from "actions";
import MainTabTeacher from "./MainTabTeacher";
const _ = require("lodash");

class MainTabContainerTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: true
        };
    }

    componentDidUpdate(prevProps) {
        const { drawerReducer, navigation } = this.props;
        if (prevProps.drawerReducer != drawerReducer) {
            if (drawerReducer.drawerOpen) {
                navigation.toggleDrawer();
            }
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <MainTabTeacher />
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
        drawerReducer: state.drawerReducer
    };
}
MainTabContainerTeacher = connect(mapStateToProps)(MainTabContainerTeacher);
export default MainTabContainerTeacher;
