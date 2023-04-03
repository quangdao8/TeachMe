
import { put, call } from 'redux-saga/effects';
import { subjectAction } from "../actions/index"
import { ServiceHandle } from '../helper';
import { Helper, Const } from '../helper/index';
const _ = require('lodash')
// selector Function used to access reducer states

export function* subjectAsync(action) {
    try {
        const response = yield call(ServiceHandle.get, "subject/", action.params);
        if (response.error) {
            yield put(subjectAction.subjectFailed(response));
        } else {
            yield put(subjectAction.subjectSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
