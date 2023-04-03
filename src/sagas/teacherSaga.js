import { put, call } from "redux-saga/effects";
import { teacherAction } from "../actions/index";
import { ServiceHandle } from "../helper";
import { Helper, Const } from "../helper/index";
import { convertToQuery } from "../helper/helper";
const _ = require("lodash");
// selector Function used to access reducer states

export function* getMapTeacherAsync(action) {
    const url = Const.GET_MAP_TEACHER_API + convertToQuery(action.params);
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error) {
            yield put(teacherAction.getMapTeacherFailed(response));
        } else {
            yield put(teacherAction.getMapTeacherSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
