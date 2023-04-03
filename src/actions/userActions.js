/*
 * Reducer actions related with login
 */
import * as types from "./types";
import { ServiceHandle } from "helper";
import { TRANSACTION } from "helper/Consts";
import { Platform } from "react-native";
import { convertToQuery } from "helper/helper";

// const BadgeAndroid = require("react-native-android-badge");

export function requestLogin(params) {
    return {
        type: types.LOGIN_REQUEST,
        params
    };
}

export function loginFailed(error) {
    return {
        type: types.LOGIN_FAILED,
        error
    };
}

export function loginSuccess(response) {
    return {
        type: types.LOGIN_SUCCESS,
        response
    };
}

export function logoutRequest() {
    return {
        type: types.LOGOUT_REQUEST
    };
}

export async function updateNotificationId(params) {
    const url = `user/${params.id}/`;
    const response = await ServiceHandle.patch(
        url,
        JSON.stringify({ notificationId: params.deviceToken, key: "YOLEARN" })
    );
    return response;
}

export function profileEditRequest(params) {
    return {
        type: types.PROFILE_EDIT_REQUEST,
        params
    };
}

export function profileEditFailed(error) {
    return {
        type: types.PROFILE_EDIT_FAILED,
        error
    };
}

export function profileEditSuccess(response) {
    return {
        type: types.PROFILE_EDIT_SUCCESS,
        response
    };
}

export function searchRequest(params) {
    return {
        type: types.SEARCH_REQUEST,
        params
    };
}

export function searchFailed(error) {
    return {
        type: types.SEARCH_FAILED,
        error
    };
}

export function searchSuccess(response) {
    return {
        type: types.SEARCH_SUCCESS,
        response
    };
}

export function transactionRequest(params) {
    return {
        type: types.TRANSACTION_REQUEST,
        params
    };
}

export function transactionFailed(error) {
    return {
        type: types.TRANSACTION_FAILED,
        error
    };
}

export function transactionSuccess(response) {
    return {
        type: types.TRANSACTION_SUCCESS,
        response
    };
}

export function transactionFullRequest(params) {
    return {
        type: types.TRANSACTION_FULL_REQUEST,
        params
    };
}

export function transactionFullFailed(error) {
    return {
        type: types.TRANSACTION_FULL_FAILED,
        error
    };
}

export function transactionFullSuccess(response) {
    return {
        type: types.TRANSACTION_FULL_SUCCESS,
        response
    };
}

export async function updateAmount(params) {
    const url = `user/${params.id}/`;
    const response = await ServiceHandle.patch(url, JSON.stringify({ amount: params.money, key: "YOLEARN" }));
    return response;
}

export async function topUpTransaction(params) {
    const param = {
        type: 0,
        title: "NAP TIEN",
        description: "null",
        amount: params.money,
        user_id: params.userId
    };
    const url = `${TRANSACTION}`;
    const response = await ServiceHandle.post(url, JSON.stringify(param));
    return response;
}

export async function getUserData(params) {
    const url = `user/${params.id}/`;
    const response = await ServiceHandle.get(url);
    return response;
}

export function hasCallAction(data) {
    return {
        type: types.HAS_CALL,
        data
    };
}

export function endCallAction() {
    return {
        type: types.END_CALL
    };
}

export async function updateBadge(params) {
    // const url = `user/${params.id}/`;
    // params.key = "YOLEARN";
    // const response = await ServiceHandle.patch(url, params);
    // if (!response.error) {
    //     const { badge } = response.response;
    //     const notifications = firebase.notifications();
    //     // Platform.OS == "android" ? BadgeAndroid.setBadge(10) :
    //     notifications.setBadge(badge);
    // }
    // return response;
}

export async function getIncomeChart(params) {
    const url = `incomeChart/${convertToQuery(params)}`;
    const response = await ServiceHandle.get(url);
    return response;
}
