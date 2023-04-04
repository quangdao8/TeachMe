import React from "react";
import { View, Alert } from "react-native";
import { connect } from "react-redux";
import { Const, Colors } from "helper";
import { types, alertActions } from "actions";
import { AppText, Container, Button, AppImage, Input } from "components";
import styles from "./styles";
import I18n from "helper/locales";
import { ICON } from "assets";
import HeaderApp from "components/Header";
import { finderRequest } from "actions/contactActions";

const _ = require("lodash");

class FindContact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            press: false,
            showModal: false
        };
    }

    componentDidUpdate(prevProps) {
        const { dispatch, userReducer, contactReducer, navigation } = this.props;
        let { press, phone } = this.state;
        if (prevProps.contactReducer !== contactReducer) {
            if (press) {
                this.setState({ press: false });
                if (contactReducer.type === types.FINDER_SUCCESS) {
                    if (
                        !_.isEmpty(contactReducer.dataFinder.results) &&
                        userReducer.data.id !== contactReducer.dataFinder.results[0].id
                    ) {
                        if (userReducer.data.type == 1 || contactReducer.dataFinder.results[0].type == 0) {
                            navigation.navigate("AddContact");
                        } else {
                            let data = contactReducer.dataFinder.results[0];
                            // let contact = {
                            //     id: data.id,
                            //     nickname: data.user.first_name + " " + data.user.last_name,
                            //     avatar: data.avatar,
                            //     // of_user: userReducer.data.id,
                            //     about_user: data
                            // };
                            navigation.navigate("DetailTeacher", { contact: { teacher: data } });
                        }
                        this.setState({ phone: "" });
                    } else {
                        setTimeout(() => {
                            const paramsAlert = {
                                content: I18n.t("Alert.cantFindPhone"),
                                title: I18n.t("Alert.notice"),
                                type: Const.ALERT_TYPE.INFO
                            };
                            dispatch(alertActions.openAlert(paramsAlert));
                        }, 200);
                    }
                    return;
                }
            }
            if (contactReducer.type === types.GET_DEVICE_CONTACT_REQUEST) {
                this.setState({ phone: contactReducer.phoneDevice });
            }
        }
    }

    validate = phone => {
        return phone;
    };

    convertPhone(phone) {
        let result = phone.replace(/\+/g, "");
        let head = result.slice(0, 2);
        let head1 = result.slice(0, 3);
        if (head1 == "840") {
            result = "0" + result.slice(3, result.length);
        } else if (head == "84") {
            result = "0" + result.slice(2, result.length);
        }
        return result;
    }

    onContinue() {
        const { dispatch } = this.props;
        const { phone } = this.state;
        if (!this.validate(phone)) {
            setTimeout(() => {
                const paramsAlert = {
                    content: I18n.t("Alert.inputPhonePlease"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.INFO
                };
                dispatch(alertActions.openAlert(paramsAlert));
            }, 200);
            return;
        }
        this.setState({ press: true }, () => {
            if (!this.validate(phone)) {
                setTimeout(() => {
                    this.setState({ press: false }, () => {
                        Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.inputPhonePlease"));
                    });
                }, 200);
                return;
            }

            let param = {
                phone_number: this.convertPhone(phone)
            };
            dispatch(finderRequest(param));
        });
    }

    onScan() {
        this.props.navigation.navigate("QRScan");
    }

    render() {
        const { phone, press, showModal } = this.state;
        const { navigation } = this.props;
        return (
            <Container contentContainerStyle={styles.container} scrollEnabled={false}>
                <HeaderApp title={I18n.t("FindContact.addContact")} isBack navigation={this.props.navigation} />
                <View style={styles.body}>
                    <View style={{ flex: 1, width: "100%", justifyContent: "space-evenly" }}>
                        <View style={styles.input}>
                            <Input
                                containerStyles={{ width: "100%" }}
                                placeholder={I18n.t("FindContact.phoneInput")}
                                placeholderTextColor={Colors.DIABLED_BUTTON}
                                keyboardType="email-address"
                                onChangeText={e => this.setState({ phone: e.trim() })}
                                value={phone}
                                // maxLength={15}
                                style={[styles.button]}
                            />
                        </View>
                        <Button
                            disabled={press}
                            onPress={() => this.onContinue()}
                            style={styles.button}
                            title={I18n.t("FindContact.continue").toUpperCase()}
                        />
                        <Button
                            disabled={press}
                            onPress={() => navigation.navigate("AddDeviceContact")}
                            style={[styles.button]}
                            title={I18n.t("FindContact.contacts").toUpperCase()}
                        />
                    </View>
                    <View style={[styles.content, { flex: 1, justifyContent: "space-evenly" }]}>
                        <AppText text={I18n.t("FindContact.QRScan")} style={styles.text} />
                        <AppImage source={ICON.QRCODE} style={[styles.image]} />
                        <Button
                            onPress={() => this.onScan()}
                            style={styles.button}
                            title={I18n.t("FindContact.QR").toUpperCase()}
                        />
                        <View style={styles.footer} />
                    </View>
                </View>
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
FindContact = connect(mapStateToProps)(FindContact);
export default FindContact;
