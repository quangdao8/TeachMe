import { put, call } from "redux-saga/effects";
import { ServiceHandle } from "../helper";
import { callActions } from "../actions";
import { convertToQuery } from "../helper/helper";

const _ = require("lodash");

export function* callerAsync(action) {
    let url = "call_log_user/" + action.params + "/";
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error) {
            _.includes(action.params, "/")
                ? yield put(callActions.callDetailsFailed(response.errorMessage))
                : yield put(callActions.callHistoryFailed(response.errorMessage));
        } else {
            _.includes(action.params, "/")
                ? yield put(callActions.callDetailsSuccess(response.response))
                : yield put(callActions.callHistorySuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* callerDetailAsync(action) {
    let url = "call_log/" + convertToQuery(action.params);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error) {
            yield put(callActions.callDetailsFailed(response.errorMessage));
        } else {
            yield put(callActions.callDetailsSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
