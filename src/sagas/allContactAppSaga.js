import { put, call } from "redux-saga/effects";
import { allContactAppAction } from "../actions/index";
import { ServiceHandle } from "../helper";
import { convertToQuery } from "../helper/helper";
import _ from "lodash";

export function* getContactAppAsync(action) {
    const url = "all_phone_number/";
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(allContactAppAction.getContactAppFailed(response.errorMessage));
        } else {
            yield put(allContactAppAction.getContactAppSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
