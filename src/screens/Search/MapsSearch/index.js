import React from "react";
import { connect } from "react-redux";
import { View, KeyboardAvoidingView, Text, Modal, StatusBar, Picker, FlatList } from "react-native";
import { AppImageCircle, AppText, Container, Input, Button, AppImage, HeaderApp } from "components";
import MapView from "react-native-maps";
import { Icon } from "native-base";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Images, ICON } from "assets";
import { Colors, Const, Helper, ServiceHandle } from "helper";
import { DEVICE, PD, DIMENSION } from "helper/Consts";
import styles from "./styles";
import I18n from "helper/locales";
import { types } from "actions";
// import { from } from "rxjs";

const H3 = DIMENSION.H3;

class MapsSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schools: "",
            PickerValue: "",
            PickerValue1: "",
            PickerValue2: ""
        };
        this.inputRefs = {};
    }

    render() {
        return (
            <Container style={{ backgroundColor: Colors.SKY_BLUE }}>
                <MapView
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        registerReducer: state.registerReducer,
        checkPhoneReducer: state.checkPhoneReducer
    };
}
MapsSearch = connect(mapStateToProps)(MapsSearch);
export default MapsSearch;
