import React, { Component } from "react";
import { FlatList, View, Modal, Platform, PermissionsAndroid, TouchableOpacity, ActivityIndicator } from "react-native";
import { DIMENSION, PD } from "helper/Consts";
import { HeaderApp, AppText, Button, AppImage, Container } from "components";
import Contacts from "react-native-contacts";
import I18n from "helper/locales";
import { Colors, Convert } from "helper/index";
import { connect } from "react-redux";
import { ICON } from "assets";
import { nospecial, characters } from "./data";
import styles from "./styles";
import { contactAction } from "actions";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Spinner } from "native-base";
import RenderItem from "./renderItem";
const _ = require("lodash");

class AddDeviceContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataContact: [],
            dataSearch: [],
            spinner: true
        };
    }

    componentDidMount() {
        this.getContact().then(result => {
            let array = result.map(obj => {
                const familyName = !_.isNull(obj.familyName) ? `${obj.familyName} ` : "";
                const middleName = !_.isNull(obj.middleName) ? `${obj.middleName} ` : "";
                const givenName = !_.isNull(obj.givenName) ? `${obj.givenName}` : "";
                const fullName =
                    Platform.OS == "ios"
                        ? `${familyName}${middleName}${givenName}`.trim()
                        : `${givenName} ${middleName}${familyName}`.trim();
                return {
                    ...obj,
                    fullName
                };
            });
            let contact = this.divideGroupArray(array);
            this.setState({ dataContact: contact, dataSearch: contact, spinner: false });
        });
    }

    async getContact() {
        let emptyList = [];
        return new Promise(async (resolve, reject) => {
            if (Platform.OS == "android") {
                const requestPermisstion = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: I18n.t("Alert.contacts"),
                        message: I18n.t("Alert.contactRquest")
                    }
                );

                if (requestPermisstion == PermissionsAndroid.RESULTS.GRANTED) {
                    this.setState({ loading: true }, () => {
                        Contacts.getAll((err, contacts) => {
                            if (err === "denied") {
                            } else {
                                resolve(contacts);
                            }
                        });
                    });
                } else {
                    resolve(emptyList);
                }
            } else {
                this.setState({ loading: true }, () => {
                    Contacts.getAll((err, contacts) => {
                        if (err == "denied") {
                            resolve(emptyList);
                        } else {
                            resolve(contacts);
                        }
                    });
                });
            }
        });
    }
    divideGroupArray(data) {
        let result = data.sort((a, b) => {
            return a.fullName.localeCompare(b.fullName);
        });

        return result;
    }
    listEmptyComponent = () => {
        let { spinner, dataSearch } = this.state;
        return spinner ? (
            <Spinner color={Colors.BLACK_TEXT_COLOR} size="small" />
        ) : _.isEmpty(dataSearch) ? (
            <View style={styles.containerEmpty}>
                {/* <AppText text={I18n.t("chat.emptyList")} style={styles.emptyText} /> */}
                <AppText text={I18n.t("ListUserScreen.emptyContact")} style={styles.emptyText} />
            </View>
        ) : (
            <View style={styles.containerEmpty}>
                {/* <AppText text={I18n.t("chat.emptyList")} style={styles.emptyText} /> */}
                <AppText text={I18n.t("callHistory.noResult")} style={styles.emptyText} />
            </View>
        );
    };

    onPressNumber = number => {
        const { navigation, dispatch } = this.props;
        const phone = number.replace(/[-_()\s\\]/g, "");
        navigation.goBack();
        dispatch(contactAction.getDeviceContactRequest(phone));
    };

    renderItem = props => {
        return <RenderItem {...this.props} item={props.item} onPressNumber={this.onPressNumber} />;
    };

    renderGroup = props => {
        if (props.item.length === 0) {
            return null;
        }
        return props.item.map(i => this.renderItem(i));
    };

    leftOnPress = () => {
        this.props.navigation.goBack();
    };

    onSearch = valueSearch => {
        const { dataSearch } = this.state;
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.setState({ dataContact: [], spinner: true }, () => {
                let mainData = _.filter(dataSearch, function(obj) {
                    const removeDia = Convert.removeDiacriticsDevice(obj.fullName.toLowerCase());
                    const valueRemovDia = Convert.removeDiacriticsDevice(valueSearch.toLowerCase());
                    return _.includes(removeDia, valueRemovDia);
                });
                // const data = valueSearch.trim() ? this.divideGroupArray(mainData) : this.divideGroupArray(dataSearch);
                const data = mainData;
                this.setState({ dataContact: data, spinner: false });
            });
        }, 1500);
    };

    render() {
        const { dataContact } = this.state;
        return (
            <>
                <HeaderApp
                    title={I18n.t("modalContact.title")}
                    leftOnPress={this.leftOnPress}
                    statusBar={Platform.OS == "ios" ? true : false}
                    isSearch
                    onChangeText={this.onSearch}
                    isBack
                />
                <View style={{ flex: 1, backgroundColor: Colors.CONTENT_COLOR }}>
                    <FlatList
                        // renderToHardwareTextureAndroid
                        initialNumToRender={1}
                        windowSize={11}
                        data={dataContact}
                        renderItem={props => this.renderItem(props)}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={this.listEmptyComponent}
                    />
                </View>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        allContactAppReducer: state.allContactAppReducer
    };
}
AddDeviceContact = connect(mapStateToProps)(AddDeviceContact);
export default AddDeviceContact;
