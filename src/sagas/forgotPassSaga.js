import { put, call } from "redux-saga/effects";
import { checkPhoneAction, requestCodeAction, confirmCodeAction, resetPassAction } from "../actions/index";
import { ServiceHandle, Const } from "../helper";
const _ = require("lodash");
// selector Function used to access reducer states
export function* checkPhoneAsync(action) {
    try {
        const response = yield call(ServiceHandle.post, Const.CHECK_PHONE_API, action.params);
        if (response.error) {
            if (response.problem == "TIMEOUT_ERROR") {
                yield put(checkPhoneAction.checkPhoneFailed("loi mang"));
            } else {
                yield put(checkPhoneAction.checkPhoneFailed(response.errorMessage));
            }
        } else {
            yield put(checkPhoneAction.checkPhoneSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
export function* requestCodeAsync(action) {
    try {
        const response = yield call(ServiceHandle.post, Const.REQUEST_CODE_API, action.params);
        if (response.error) {
            if (response.problem == "TIMEOUT_ERROR") {
                yield put(requestCodeAction.requestCodeFailed("loi mang"));
            } else {
                yield put(requestCodeAction.requestCodeFailed(response.errorMessage));
            }
        } else {
            yield put(requestCodeAction.requestCodeSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
export function* confirmCodeAsync(action) {
    try {
        const response = yield call(ServiceHandle.post, Const.CONFIRM_CODE_API, action.params);
        if (response.error) {
            if (response.problem == "TIMEOUT_ERROR") {
                yield put(confirmCodeAction.confirmCodeFailed("loi mang"));
            } else {
                yield put(confirmCodeAction.confirmCodeFailed(response.errorMessage));
            }
        } else {
            yield put(confirmCodeAction.confirmCodeSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
export function* resetPassAsync(action) {
    try {
        const response = yield call(ServiceHandle.post, Const.RESET_PASS_API, action.params);
        if (response.error) {
            if (response.problem == "TIMEOUT_ERROR") {
                yield put(resetPassAction.resetPassFailed("loi mang"));
            } else {
                yield put(resetPassAction.resetPassFailed(response.errorMessage));
            }
        } else {
            yield put(resetPassAction.resetPassSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
