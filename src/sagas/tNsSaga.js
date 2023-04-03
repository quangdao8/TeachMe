import { put, call } from "redux-saga/effects";
import { ServiceHandle } from "../helper";
import { convertToQuery } from "../helper/helper";
import { tNsActions } from "../actions";
const _ = require("lodash");
// selector Function used to access reducer states
export function* tNsAsync(action) {
    let url = action.params + "/";
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error) {
            action.params == "topic"
                ? yield put(tNsActions.topicFailed(response.errorMessage))
                : action.params == "specialize"
                ? yield put(tNsActions.specializeFailed(response.errorMessage))
                : action.params == "job_position"
                ? yield put(tNsActions.positionFailed(response.errorMessage))
                : action.params == "school"
                ? yield put(tNsActions.schoolFailed(response.errorMessage))
                : yield put(tNsActions.masterSettingFailed(response.response));
        } else {
            action.params == "topic"
                ? yield put(tNsActions.topicSuccess(response.response))
                : action.params == "specialize"
                ? yield put(tNsActions.specializeSuccess(response.response))
                : action.params == "job_position"
                ? yield put(tNsActions.positionSuccess(response.response))
                : action.params == "school"
                ? yield put(tNsActions.schoolSuccess(response.response))
                : yield put(tNsActions.masterSettingSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
