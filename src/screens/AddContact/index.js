import React from "react";
import { Dimensions, View, Alert } from "react-native";
import { connect } from "react-redux";
import { Const, GlobalStyles, Helper, ServiceHandle, Colors, Validate } from "helper";
import { types, userActions, alertActions } from "actions";
import { AppText, Container, Button, AppImage, Input, Card, HeaderImage, HeaderIcon } from "components";
import styles from "./styles";
import I18n from "helper/locales";
import { ICON, Images } from "assets";
import { addRequest } from "actions/contactActions";
import { avatarRequest } from "actions/contactActions";
const _ = require("lodash");

const { width, height } = Dimensions.get("window");

class AddContact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            avatar: "",
            loading: false,
            url: ""
        };
    }

    componentDidMount() {
        const { contactReducer } = this.props;
        let data = contactReducer.dataFinder.results[0].user;
        let name = data.first_name.trim() + " " + data.last_name.trim();
        let avatar = contactReducer.dataFinder.results[0].avatar;
        this.setState({
            name,
            avatar
        });
    }

    componentDidUpdate(prevProps) {
        const { contactReducer, navigation, dispatch } = this.props;
        if (prevProps.contactReducer !== contactReducer) {
            this.setState({ press: false });
            if (contactReducer.type === types.ADD_FAILED) {
                // let err = JSON.stringify(contactReducer.errorMessage)
                // err = err.toString() === "[\"Phone number already added in your contact\"]" ? I18n.t("Alert.phoneAdded") : err

                setTimeout(() => {
                    // Alert.alert(I18n.t("Alert.notice"), err);
                }, 200);
                return;
            }
            if (contactReducer.type === types.ADD_SUCCESS) {
                setTimeout(() => {
                    // Alert.alert(
                    //     I18n.t("Alert.notice"),
                    //     I18n.t("Alert.addContactSuccess"),
                    //     [{ text: "OK", onPress: () => navigation.navigate("ListUser") }],
                    //     { cancelable: false }
                    // );
                    const paramsAlert = {
                        content: I18n.t("Alert.addContactSuccess"),
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.SUCCESS
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                }, 200);
                navigation.navigate("ListUser");
                // this.setState({ phone: "" });
                return;
            }
        }
    }

    onContinue() {
        const { dispatch, contactReducer, userReducer } = this.props;
        const { name, avatar, url } = this.state;
        let t = new Validate(I18n.t("Alert.name"), name).validateBlank();
        if (t.blank) {
            const paramsAlert = {
                content: t.message,
                title: I18n.t("Alert.notice"),
                type: Const.ALERT_TYPE.WARNING
            };
            dispatch(alertActions.openAlert(paramsAlert));
            return;
        }
        const param = {
            about_user_id: contactReducer.dataFinder.results[0].id,
            nickname: name,
            avatar: url ? url : avatar
        };
        const params = {
            param,
            userId: userReducer.data.id
        };
        dispatch(addRequest(params));
    }

    render() {
        let { name, avatar, loading } = this.state;
        const { contactReducer, navigation } = this.props;
        const data = contactReducer.dataFinder.results[0];
        let phone = data.phone_number;
        let email = data.user.email ? data.user.email : "Email";

        return (
            <Container contentContainerStyle={styles.container} scrollEnabled={false}>
                <HeaderIcon
                    title={I18n.t("AddContact.addContact")}
                    imagePicker={true}
                    bgSource={Images.IMAGE_ADD_CONTACT}
                    iconSource={{ uri: avatar }}
                    styleImage={styles.avatar}
                    navigation={navigation}
                    image
                    resizeMode="cover"
                    square
                    onBackPress={() => navigation.goBack()}
                    onPickImage={(image, loading) => {
                        // this.props.dispatch(avatarRequest());
                        this.setState({ avatar: image, loading });
                    }}
                    onUploadSuccess={(url, loading) => {
                        this.setState({ url: url, loading });
                    }}
                />
                <View style={styles.body}>
                    <View style={styles.input}>
                        <Input
                            containerStyles={{ width: "100%" }}
                            placeholder={I18n.t("AddContact.name")}
                            placeholderTextColor="black"
                            onChangeText={e => this.setState({ name: e })}
                            value={name}
                            inputStyle={{ flex: 24 }}
                        />
                    </View>
                    <View style={styles.input}>
                        <Input
                            containerStyles={{ width: "100%" }}
                            placeholder={phone}
                            placeholderTextColor={Colors.DIABLED_BUTTON}
                            keyboardType="numeric"
                            disabled
                            inputStyle={{ flex: 24 }}
                        />
                    </View>
                    <View style={styles.input}>
                        <Input
                            containerStyles={{ width: "100%" }}
                            placeholder={email}
                            placeholderTextColor={Colors.DIABLED_BUTTON}
                            disabled
                            inputStyle={{ flex: 24 }}
                        />
                    </View>
                    <View style={styles.view} />

                    <Button
                        disabled={loading}
                        onPress={() => this.onContinue()}
                        style={loading ? styles.buttonDis : styles.button}
                        title={I18n.t("AddContact.continue").toUpperCase()}
                    />
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
AddContact = connect(mapStateToProps)(AddContact);
export default AddContact;
