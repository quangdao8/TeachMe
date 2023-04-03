import { put, call } from "redux-saga/effects";
import { userActions } from "../actions/index";
import { ServiceHandle } from "../helper";
const _ = require("lodash");
// selector Function used to access reducer states
export function* loginAsync(action) {
    try {
        const response = yield call(ServiceHandle.post, "login/", action.params);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(userActions.loginFailed(response.errorMessage));
        } else {
            yield put(userActions.loginSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* logoutAsync(action) {
    try {
        const response = {
            error: false
        };
        if (!response.error) {
            yield put(userActions.logoutSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
