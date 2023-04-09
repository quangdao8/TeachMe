import React from "react";
import { connect } from "react-redux";
import { TouchableOpacity, View, Dimensions, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { AppImageCircle, Container, Input, Button, AppImage, HeaderApp, FloatInput } from "components";
import mobile_src_tinh_tp from "./mobile_src_tinh_tp";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { ICON, FONT_SF } from "assets";
import { Colors } from "helper";
import { DEVICE, PD, DIMENSION } from "helper/Consts";
import styles from "./styles";
import I18n from "helper/locales";
import { searchRequest } from "actions/userActions";
import { types } from "actions/index";
import { topicRequest, specializeRequest, positionRequest, schoolRequest } from "actions/tNsActions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { Picker } from "native-base";
import _ from "lodash";
import AutocompletePicker from "components/AutocompletePicker";

const H3 = DIMENSION.H3;

class Advancedsearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: { id: "", name: "" },
            specialize: { id: "", name: "" },
            job_position: { id: "", name: "" },
            city: "",
            latitude: "",
            longitude: "",
            name: "",
            focus: false,
            showModal: false,
            school: { id: "", name: "" },
            topicName: ""
        };
        this.params = "";
    }

    UNSAFE_componentWillMount() {
        const { navigation, dispatch } = this.props;
        dispatch(topicRequest("topic"));
        dispatch(specializeRequest("specialize"));
        dispatch(positionRequest("job_position"));
        dispatch(schoolRequest("school"));
    }

    componentDidUpdate(prevProps) {
        const { userReducer, navigation } = this.props;
        if (prevProps.userReducer !== userReducer) {
            if (userReducer.type === types.SEARCH_SUCCESS) {
                setTimeout(() => {
                    navigation.navigate("ListSearch", { params: this.params });
                }, 200);
            }
        }
    }

    search() {
        const { navigation, dispatch } = this.props;
        const { topic, specialize, job_position, city, school } = this.state;
        const params = {};

        if (topic.id) {
            params.topic = topic.id;
        }
        if (specialize.id) {
            params.specialize = specialize.id;
        }
        if (job_position.id) {
            params.job_position = job_position.id;
        }
        if (city.name) {
            params.city = city.name;
        }
        if (school.id) {
            params.school = school.id;
        }
        params.type = 1;

        this.params = params;

        dispatch(searchRequest(params));
        // setTimeout(() => {
        //     navigation.navigate("ListSearch");
        // }, 1000);
    }

    // saveData(firstItemName, itemValue, itemPos) {
    //     switch (firstItemName) {
    //         case "Chọn thành phố":
    //             this.setState({ city: itemValue });
    //             break;
    //         case "Chọn chủ đề":
    //             const { tNsReducer } = this.props;
    //             const { dataTopic } = tNsReducer;
    //             let { topicName } = this.state;
    //             const index = _.findIndex(dataTopic, obj => {
    //                 return itemValue == obj.id;
    //             });
    //             dataTopic[index] && (topicName = `${dataTopic[index].name}`);
    //             this.setState({ topic: itemValue, topicName });
    //             break;
    //         case "Chọn chuyên môn":
    //             this.setState({ specialize: itemValue });
    //             break;
    //         case "Chọn chức vụ":
    //             this.setState({ job_position: itemValue });
    //             break;
    //         case "Chọn trường học":
    //             this.setState({ school: itemValue });
    //             break;
    //         default:
    //             break;
    //     }
    // }

    onPicker(firstItemName, item) {
        switch (firstItemName) {
            case I18n.t("advancedsearch.electCity"):
                this.setState({ city: item });
                break;
            case I18n.t("advancedsearch.electTopic"):
                this.setState({ topic: item, specialize: { id: "", name: "" } });
                break;
            case I18n.t("advancedsearch.electSpecialize"):
                this.setState({ specialize: item });
                break;
            case I18n.t("advancedsearch.electPosition"):
                this.setState({ job_position: item });
                break;
            case I18n.t("advancedsearch.electSchool"):
                this.setState({ school: item });
                break;
            default:
                break;
        }
    }

    renderPicker(data, firstItemName, icon, selectedValue) {
        data = data || [];

        return (
            <View style={styles.dropdown}>
                <View style={styles.imageWrap}>
                    <AppImage local source={icon} style={styles.iconPicker} />
                </View>
                <View style={styles.pickerWrap}>
                    {/* <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemPos) => this.saveData(firstItemName, itemValue, itemPos)}
                    >
                        <Picker.Item label={firstItemName} value="" />
                        {_.isNull(data)
                            ? null
                            : data.map((item, index) => {
                                  return (
                                      <Picker.Item
                                          key={index}
                                          label={
                                              firstItemName == "Chọn chuyên môn" && this.state.topic
                                                  ? this.state.topicName + " " + item.name
                                                  : item.name
                                          }
                                          value={icon == ICON.CITY ? item.name : item.id}
                                      />
                                  );
                              })}
                    </Picker> */}
                    <FloatInput
                        label={firstItemName}
                        editer={true}
                        searchTeacher
                        picker
                        list={data}
                        // initValue={this.listTopicId.indexOf(item.topic_id)}
                        onPicker={item => {
                            this.onPicker(firstItemName, item);
                        }}
                        value={selectedValue.name || firstItemName}
                        inputStyle={{
                            backgroundColor: Colors.WHITE_COLOR,
                            alignItems: "center",
                            minHeight: Platform.OS == "android" ? responsiveFontSize(4.4) : "auto"
                        }}
                    />
                </View>
            </View>
        );
    }

    convertCity() {
        const city = Object.values(mobile_src_tinh_tp).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        return city.map(el => {
            return {
                id: el.code,
                name: el.name
            };
        });
    }

    render() {
        const { tNsReducer } = this.props;
        let city = this.convertCity();
        const specialize = _.isEmpty(tNsReducer.dataSpecialize) ? [] : tNsReducer.dataSpecialize;
        const topic = _.isEmpty(tNsReducer.dataTopic) ? [] : tNsReducer.dataTopic;
        const position = _.isEmpty(tNsReducer.dataPosition) ? [] : tNsReducer.dataPosition;
        const school = _.isEmpty(tNsReducer.dataSchool) ? [] : tNsReducer.dataSchool;
        const disabled =
            !this.state.city &&
            !this.state.job_position &&
            !this.state.specialize &&
            !this.state.topic &&
            !this.state.school;
        let listSpecialize = specialize.filter(el => {
            return el.topic && el.topic.id == this.state.topic.id;
        });

        return (
            <View style={{ backgroundColor: Colors.CONTENT_COLOR, flex: 1 }}>
                <HeaderApp title={I18n.t("advancedsearch.title")} isBack navigation={this.props.navigation} />
                <Container showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                        <View style={styles.mg1}>
                            <AppImageCircle
                                local
                                image
                                styleImage={{ height: H3 - 50, width: H3 - 50, borderRadius: 0 }}
                                resizeMode="cover"
                                source={ICON.LAYER}
                            />
                        </View>
                        <View style={styles.inputsWrap}>
                            <View style={styles.mg}>
                                {this.renderPicker(
                                    city,
                                    I18n.t("advancedsearch.electCity"),
                                    ICON.CITY,
                                    this.state.city
                                )}
                                {this.renderPicker(
                                    school,
                                    I18n.t("advancedsearch.electSchool"),
                                    ICON.SCHOOLS,
                                    this.state.school
                                )}
                                {this.renderPicker(
                                    topic,
                                    I18n.t("advancedsearch.electTopic"),
                                    ICON.SUBJECTS,
                                    this.state.topic
                                )}
                                {this.renderPicker(
                                    listSpecialize,
                                    I18n.t("advancedsearch.electSpecialize"),
                                    ICON.SUBJECTS,
                                    this.state.specialize
                                )}
                                {this.renderPicker(
                                    position,
                                    I18n.t("advancedsearch.electPosition"),
                                    ICON.POSITION,
                                    this.state.job_position
                                )}
                            </View>
                            <Button
                                disabled={disabled}
                                title={I18n.t("advancedsearch.button")}
                                style={disabled ? styles.buttonDis : styles.button}
                                onPress={() => this.search()}
                                tStyle={{ fontWeight: "bold", fontSize: responsiveFontSize(2.0) }}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </Container>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        registerReducer: state.registerReducer,
        checkPhoneReducer: state.checkPhoneReducer,
        tNsReducer: state.tNsReducer,
        userReducer: state.userReducer
    };
}
Advancedsearch = connect(mapStateToProps)(Advancedsearch);
export default Advancedsearch;
