/* eslint-disable react/no-unused-state */
import React from "react";
import {
    TouchableOpacity,
    View,
    Dimensions,
    Modal,
    KeyboardAvoidingView,
    TextInput,
    Platform,
    FlatList
} from "react-native";
import { Const, GlobalStyles, Helper, ServiceHandle, Colors, Validate, Convert } from "../helper";
import { Button, Container } from "./index";
import { HeaderApp, AppText, LocalNotification } from "../components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "../assets";

export default class AutocompletePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // value: ""
            indexs: [0]
        };
        this.data = [{ id: "", name: this.props.title }];
    }

    componentDidUpdate(prevProps) {
        const { data } = this.props;
        if (prevProps.data !== data) {
            this.onRefresh();
        }
    }

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh() {
        const { data } = this.props;
        this.listName = data.map(el => {
            return Convert.removeDiacritics(el.name.toLowerCase());
        });
        this.data = this.convertData(data);
        this.onChangeText("");
    }

    convertData(data) {
        const { title } = this.props;
        return [
            {
                id: "",
                name: title
            },
            ...data
        ];
    }

    onPress(item) {
        const { onPressItem = () => {} } = this.props;
        let param = { ...item };
        if (!param.id) param.name = "";
        this.onChangeText("");
        onPressItem(param);
        // this.setState({ value: item.name });
    }

    searchFn(value) {
        let valueConvert = Convert.removeDiacritics(value);
        let indexs = [];
        this.listName.map((el, index) => {
            if (el.includes(valueConvert) || !value) {
                indexs = [...indexs, index + 1];
            }
        });
        if (!valueConvert.trim()) {
            indexs = [0, ...indexs];
        }

        return indexs;
    }

    onChangeText(value) {
        let valueNew = value.trim().toLowerCase();
        this.setState({ indexs: this.searchFn(valueNew) });
    }

    renderItem(item, index) {
        let { indexs } = this.state;
        return (
            indexs.indexOf(index) > -1 && (
                <TouchableOpacity style={styles.item} onPress={() => this.onPress(item)}>
                    <AppText text={item.name} style={styles.name} numberOfLines={1} />
                </TouchableOpacity>
            )
        );
    }

    renderModal() {
        let { showPicker, title, onBackPress = () => {}, data, modalVisibleToggle = () => {} } = this.props;
        return (
            <Modal visible={showPicker} coverScreen={false} onRequestClose={modalVisibleToggle}>
                <HeaderApp
                    isSearch
                    isBack
                    title={title}
                    // titleStyle={{ fontSize: responsiveFontSize(2.6) }}
                    onChangeText={e => this.onChangeText(e)}
                    leftOnPress={() => onBackPress()}
                    statusBar={Platform.OS == "ios" ? true : false}
                    headerContainer={
                        Platform.OS == "ios" ? {} : { paddingTop: 0, height: Const.DIMENSION.HEADER_HEIGHT }
                    }
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={{ paddingBottom: keyboardHeight }}
                    data={this.data}
                    style={{ backgroundColor: Colors.BACKGROUND_COLOR }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state.indexs}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                />
            </Modal>
        );
    }

    // showModal() {
    //     this.setState({ showModal: true });
    // }

    render() {
        const { searchTeacher, value } = this.props;
        return (
            <KeyboardAvoidingView
                style={{ width: "100%", flexDirection: "row", alignItems: "center", backgroundColor: Colors.SKY_BLUE }}
                behavior="padding"
                enabled
            >
                {searchTeacher ? (
                    <AppText {...this.props} canPress={true} numberOfLines={1} text={value} />
                ) : (
                    <TextInput {...this.props} numberOfLines={1} editable={false} />
                )}
                {this.renderModal()}
            </KeyboardAvoidingView>
        );
    }
}

let styles = {
    item: {
        backgroundColor: Colors.BACKGROUND_COLOR,
        // height: 35,
        // paddingHorizontal: Const.PD.PADDING_3,
        padding: Const.PD.PADDING_3,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.WHITE_COLOR,
        justifyContent: "center"
    },
    name: {
        // height: 50,
        fontSize: responsiveFontSize(2.4),
        fontFamily: FONT_SF.REGULAR
        // justifyContent: "flex-start"
        // flex: 1
    }
};
