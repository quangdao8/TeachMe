/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
import { Const, I18n } from "../helper/index";
import _ from "lodash";

const initialState = {
    content: "",
    title: "",
    type: "",
    showAlert: false,
    showModal: false
};

function convertMessage(messages) {
    let message = messages;
    !_.isEmpty(message.errorMessage)
        ? !_.isEmpty(message.errorMessage.detail)
            ? (message = message.errorMessage.detail)
            : null
        : // : !_.isEmpty(message.errorMessage.user_fee[0]) && (message = message.errorMessage.user_fee[0])
          null;
    !_.isEmpty(message.detail) ? (message = message.detail) : null;
    !_.isString(message) ? (message = JSON.stringify(message)) : null;
    let errorMessage = "";
    if (message.includes("t used") && message.includes("Phone number")) {
        let a = message.split(" ");
        return I18n.t("Alert.phoneNumber") + " " + a[2] + " " + I18n.t("Alert.hasntUsed");
    }
    // if (message.includes("Wrong phone number or password")) {
    //     return I18n.t("Alert.wrong");
    // }
    if (message.includes("!DOCTYPE")) {
        return "ERROR <!DOCTYPE html>";
    }
    if (message.includes("TIMEOUT")) {
        return I18n.t("Alert.createChatGroupError");
    }
    if (message.includes("Phone number/email already used")) {
        return I18n.t("Alert.phoneOrEmailAlreadyUsed");
    }
    // if (message.includes("NETWORK_ERROR")) {
    //     return I18n.t("Alert.networkErr");
    // }
    switch (message) {
        case "Phone number already added in your contact":
            errorMessage = I18n.t("Alert.phoneAdded");
            break;
        case "Wrong phone number or password":
            errorMessage = I18n.t("Alert.wrong");
            break;
        case "Wrong code":
            errorMessage = I18n.t("Alert.wrongCode");
            break;
        case "Email not exist":
            errorMessage = I18n.t("Alert.emailNotExist");
            break;
        case "NETWORK_ERROR":
            errorMessage = I18n.t("Alert.networkErr");
            break;
        case "Not found.":
            errorMessage = I18n.t("Alert.clientErr");
            break;
        case "Invalid token.":
            errorMessage = I18n.t("Alert.unAuth");
            break;
        case "Authentication credentials were not provided.":
            errorMessage = I18n.t("Alert.createChatGroupError");
            break;
        default:
            errorMessage = message;
            break;
    }
    return errorMessage;
}

export function alertReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type.includes("FAILED")) {
        let message = action.error;
        return {
            ...state,
            content: convertMessage(message),
            title: I18n.t("error"),
            type: Const.ALERT_TYPE.ERROR,
            showAlert: true,
            showModal: false
        };
    }
    if (action.type === types.ALERT_OPEN) {
        return {
            ...state,
            ...action.params,
            showAlert: true
        };
    }
    if (action.type === types.ALERT_CLOSE) {
        return {
            ...state,
            content: "",
            title: "",
            type: "",
            showAlert: false
        };
    }
    if (action.type === types.MODAL_OPEN) {
        return {
            ...state,
            showModal: true
        };
    }
    if (action.type === types.MODAL_CLOSE) {
        return {
            ...state,
            showModal: false
        };
    }
    return state;
}
