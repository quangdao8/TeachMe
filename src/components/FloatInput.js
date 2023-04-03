import React from "react";
import { View, TextInput, TouchableOpacity, Keyboard } from "react-native";
// import { Item, Input, Label, Picker } from "native-base";
import { ICON, FONT_SF } from "../assets";
import { FONT_SIZE, DIMENSION, PD } from "../helper/Consts";
import { Colors, Const } from "../helper";
import { AppImage, AppText } from "../components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import _ from "lodash";
import AutocompleteLocation from "./AutocompleteLocation";
import AutocompletePicker from "./AutocompletePicker";
import I18n from "../helper/locales";
import { connect } from "react-redux";

class FloatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            // selectedValue: "",
            isDateTimePickerVisible: false,
            press: false,
            showModal: false,
            showPicker: false,
            keyboardShow: false
        };
        this.picker = "";
        this.input = "";

        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount() {
        // const { initValue, list, picker } = this.props;
        // let { selectedValue } = this.state;
        // if (picker) {
        //     this.setState({
        //         selectedValue: initValue
        //     });
        // }
    }

    _keyboardDidShow = () => {
        this.setState({ keyboardShow: true });
    };

    _keyboardDidHide = () => {
        this.setState({ focus: false, keyboardShow: false });
    };

    // onPickerFloatInput = gender => {
    //     this.props.onPicker(gender);
    // };

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        let d = moment(date).isBefore(moment()) ? moment(date) : moment();
        this.props.onDatePicker(d.format("YYYY-MM-DD"));
        this.hideDateTimePicker();
    };

    onClickPicker() {
        this.picker.focus();
    }

    onClickEditer() {
        this.setState({ press: true }, () => {
            this.input ? this.input.focus() : "";
        });
    }

    getLocation() {
        this.setState({ showModal: true });
    }

    openPicker() {
        this.setState({ showPicker: true });
    }

    convertList(list) {
        let listPicker = [];
        list.map(el => {
            listPicker = [
                ...listPicker,
                {
                    value: el
                }
            ];
        });
        return listPicker;
    }

    convertLabel(label) {
        let title = "";
        switch (label) {
            case I18n.t("profileDetails.topic"):
                title = I18n.t("profileDetails.selectTopic");
                break;
            case I18n.t("profileDetails.specialize"):
                title = I18n.t("profileDetails.selectSpecialize");
                break;
            case I18n.t("profileDetails.position"):
                title = I18n.t("profileDetails.selectPosition");
                break;
            case I18n.t("profileDetails.city"):
                title = I18n.t("profileDetails.selectCity");
                break;
            case I18n.t("profileDetails.school"):
                title = I18n.t("profileDetails.selectSchool");
                break;
            case I18n.t("profileDetails.gender"):
                title = I18n.t("profileDetails.selectGender");
                break;
            default:
                title = label;
                break;
        }
        return title;
    }

    closeModal() {
        this.setState({ showModal: false });
    }
    closePicker() {
        this.setState({ showPicker: false });
    }
    render() {
        let {
            label,
            iconStyle = {},
            containerStyle = {},
            inputStyle = {},
            editer = false,
            onChangeText = () => {},
            onValueChange = () => {},
            picker,
            list = [],
            initValue,
            value,
            datePicker,
            onDatePicker = () => {},
            onPicker = () => {},
            onGetLocation = () => {},
            location,
            brief = false,
            searchTeacher
        } = this.props;
        let { focus, selectedValue, isDateTimePickerVisible, press, showModal, showPicker, keyboardShow } = this.state;

        return searchTeacher ? (
            <View>
                <AutocompletePicker
                    modalVisibleToggle={() => this.closePicker()}
                    {...this.props}
                    showPicker={showPicker}
                    style={[styles.searchTeacher, inputStyle]}
                    title={this.convertLabel(label)}
                    data={list}
                    onPress={() => this.setState({ showPicker: true })}
                    onBackPress={() => this.setState({ showPicker: false })}
                    onPressItem={item => {
                        onPicker(item);
                        this.setState({ showPicker: false });
                    }}
                    value={value}
                    searchTeacher={true}
                />
            </View>
        ) : (
            <View style={[focus ? styles.itemWrapBlue : styles.itemWrap, containerStyle]}>
                <View style={styles.inputWrap}>
                    <View>
                        <AppText style={focus ? styles.labelBlue : styles.label} text={label} />
                        {location ? (
                            <AutocompleteLocation
                                {...this.props}
                                ref={ref => (this.inputLocation = ref)}
                                showModal={showModal}
                                // onPressText={() => this.setState({ showModal: true })}
                                onPressCancel={() => this.setState({ showModal: false })}
                                modalVisibleToggle={() => this.closeModal()}
                                location
                                icon
                                editable={editer}
                                onFocus={() => this.setState({ focus: true })}
                                onBlur={() => this.setState({ focus: false, press: false })}
                                style={[styles.input, inputStyle]}
                                onChange={(address, location) => {
                                    onGetLocation(address, location.lng, location.lat);
                                    this.setState({ showModal: false });
                                }}
                                // onPress={press && null}
                                multiline={true}
                            />
                        ) : picker ? (
                            <AutocompletePicker
                                {...this.props}
                                modalVisibleToggle={() => this.closePicker()}
                                showPicker={showPicker}
                                style={[styles.input, inputStyle]}
                                title={this.convertLabel(label)}
                                data={list}
                                onBackPress={() => this.setState({ showPicker: false })}
                                onPressItem={item => {
                                    onPicker(item);
                                    this.setState({ showPicker: false });
                                }}
                                value={value}
                            />
                        ) : (
                            <TextInput
                                {...this.props}
                                ref={ref => (this.input = ref)}
                                editable={!datePicker && !picker && editer}
                                style={[styles.input, inputStyle]}
                                onChangeText={text => onChangeText(text)}
                                onFocus={() => this.setState({ focus: true })}
                                onBlur={() => this.setState({ focus: false, press: false })}
                                selectionColor={Colors.MAIN_COLOR}
                                multiline={true}
                            />
                        )}
                    </View>
                </View>

                {editer ? (
                    datePicker ? (
                        <View style={[styles.iconWrap]}>
                            <DateTimePicker
                                isVisible={isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                                date={
                                    new Date(initValue)
                                    // isDateTimePickerVisible
                                    //     ? new Date(moment(initValue, "YYYY-MM-DD").format("YYYY,MM,DD"))
                                    //     : 0
                                }
                                locale={this.props.languageReducer.language}
                                confirmTextIOS={I18n.t("Alert.confirm")}
                                cancelTextIOS={I18n.t("Alert.cancel")}
                                titleIOS={I18n.t("Alert.pickADate")}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.iconWrap,
                                    {
                                        paddingVertical: Const.PD.PADDING_4,
                                        paddingLeft: "1000%",
                                        paddingRight: PD.PADDING_1 + 1
                                    }
                                ]}
                                onPress={this.showDateTimePicker}
                            >
                                <AppImage
                                    local
                                    source={ICON.CALENDAR}
                                    style={[styles.icon, iconStyle]}
                                    resizeMode={"contain"}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : brief ? (
                        <TouchableOpacity style={styles.editBrief} onPress={() => this.onClickEditer()}>
                            <AppImage
                                local
                                source={focus ? ICON.CLOSE_BLUE : ICON.PENCIL}
                                style={[styles.icon, iconStyle]}
                                resizeMode={"contain"}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.iconWrap]}>
                            <TouchableOpacity
                                style={[
                                    styles.iconWrap,
                                    {
                                        paddingVertical: Const.PD.PADDING_4,
                                        paddingLeft: location || picker ? "1000%" : "100%",
                                        paddingRight: PD.PADDING_1 + 1
                                    }
                                ]}
                                onPress={() =>
                                    location ? this.getLocation() : picker ? this.openPicker() : this.onClickEditer()
                                }
                            >
                                <AppImage
                                    local
                                    source={focus ? ICON.CLOSE_BLUE : ICON.PENCIL}
                                    style={[styles.icon, iconStyle]}
                                    resizeMode={"contain"}
                                />
                            </TouchableOpacity>
                        </View>
                    )
                ) : null}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        languageReducer: state.languageReducer,
    };
}
FloatInput = connect(mapStateToProps)(FloatInput);
export default FloatInput;

//  function validateInput() {
//         const { nameValue } = this.props;
//         const { text } = this.state;
//         const ValidateInput = new Validate(nameValue, text);
//         return ValidateInput.validateBlank();
// }

const styles = {
    itemWrap: {
        flex: 1,
        // minHeight: DIMENSION.INPUT_HEIGHT,
        flexDirection: "row",
        alignItems: "flex-end",
        borderBottomWidth: 1,
        borderBottomColor: Colors.DIABLED_BUTTON
    },
    itemWrapBlue: {
        flex: 1,
        // minHeight: DIMENSION.INPUT_HEIGHT,
        flexDirection: "row",
        alignItems: "flex-end",
        borderBottomWidth: 2,
        borderBottomColor: Colors.MAIN_COLOR
    },
    inputWrap: {
        flex: 7
    },
    input: {
        // flex: 1,
        padding: 0,
        fontSize: responsiveFontSize(2.2),
        minHeight: responsiveFontSize(4.95),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR,
        width: "100%"
    },
    searchTeacher: {
        // flex: 1,
        fontSize: responsiveFontSize(2.2),
        // minHeight: responsiveFontSize(4.4),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR,
        width: "100%"
    },
    iconWrap: {
        flex: 1,
        height: responsiveFontSize(4.95),
        justifyContent: "center",
        alignItems: "flex-end"
    },
    icon: {
        height: 12,
        aspectRatio: 1
    },
    label: {
        height: responsiveFontSize(3),
        fontSize: responsiveFontSize(1.9),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.DIABLED_BUTTON
    },
    labelBlue: {
        height: responsiveFontSize(3),
        fontSize: responsiveFontSize(1.9),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.MAIN_COLOR
    },
    pickerText: {
        fontSize: responsiveFontSize(2.2),
        // height: responsiveFontSize(3.6),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR
    },
    pickerStyle: {
        justifyContent: "center",
        // alignSelf: "auto",
        height: responsiveFontSize(4.95)
        // backgroundColor: "pink"
        // paddingBottom: responsiveFontSize(1.5)
        // marginBottom: 0
    },
    editBrief: {
        position: "absolute",
        zIndex: 2,
        top: 0,
        width: "100%",
        height: responsiveFontSize(3) + PD.PADDING_2,
        // height: 60 - responsiveFontSize(3.6),
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: PD.PADDING_1
    }
};
