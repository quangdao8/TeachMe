import { put, call } from "redux-saga/effects";
import { favoriteAction } from "../actions/index";
import { convertToQuery } from "../helper/helper";
import { ServiceHandle } from "../helper";
const _ = require("lodash");

export function* getFavoriteAsync(action) {
    const url = "favorite_teacher/" + action.params + "/";
    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(favoriteAction.getFavoriteTeacherFailed(response.errorMessage));
        } else {
            yield put(favoriteAction.getFavoriteTeacherSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* sendFavoriteAsync(action) {
    const url = "favorite_teacher/";
    try {
        const response = yield call(ServiceHandle.post, url, action.params);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(favoriteAction.sendFavoriteTeacherFailed(response.errorMessage));
        } else {
            yield put(favoriteAction.sendFavoriteTeacherSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* deleteFavoriteAsync(action) {
    const url = "favorite_teacher/" + action.params + "/";
    try {
        const response = yield call(ServiceHandle.delete, url);
        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(favoriteAction.deleteFavoriteTeacherFailed(response.errorMessage));
        } else {
            yield put(favoriteAction.deleteFavoriteTeacherSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* getListFavoriteAsync(action) {
    const url = "favorite_teacher/" + convertToQuery(action.params);
    try {
        const response = yield call(ServiceHandle.get, url, action.params);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(favoriteAction.getListFavoriteTeacherFailed(response.errorMessage));
        } else {
            yield put(favoriteAction.getListFavoriteTeacherSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
