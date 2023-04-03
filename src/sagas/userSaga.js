import { put, call } from "redux-saga/effects";
import { userActions } from "../actions/index";
import { convertToQuery } from "../helper/helper";
import { ServiceHandle } from "../helper";
const _ = require("lodash");
// selector Function used to access reducer states
export function* loginAsync(action) {
    try {
        const response = yield call(ServiceHandle.post, "login/", action.params);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.loginFailed(response.errorMessage));
        } else {
            yield put(userActions.loginSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* profileEditAsync(action) {
    const url = "user/" + action.params.id + "/";
    action.params.key = "YOLEARN";
    try {
        const response = yield call(ServiceHandle.patch, url, action.params);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.profileEditFailed(response.errorMessage));
        } else {
            yield put(userActions.profileEditSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* searchAsync(action) {
    const url = "user/" + convertToQuery(action.params);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.searchFailed(response.errorMessage));
        } else {
            yield put(userActions.searchSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* transactionAsync(action) {
    const url = "transaction/" + convertToQuery(action.params);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.transactionFailed(response.errorMessage));
        } else {
            yield put(userActions.transactionSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* transactionFullAsync(action) {
    const url = "transaction/" + convertToQuery(action.params);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.transactionFullFailed(response.errorMessage));
        } else {
            yield put(userActions.transactionFullSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
