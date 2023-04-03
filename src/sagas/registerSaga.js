import { put, call } from "redux-saga/effects";
import { registerActions } from "../actions/index";
import { ServiceHandle } from "../helper";
const _ = require("lodash");
// selector Function used to access reducer states

export function* registerAsync(action) {
    try {
        const response = yield call(ServiceHandle.post, "user/", action.params);
        if (response.error) {
            yield put(registerActions.sendRegisterFailed(response));
        } else {
            yield put(registerActions.sendRegisterSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
