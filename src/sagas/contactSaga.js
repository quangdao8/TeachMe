import { put, call } from "redux-saga/effects";
import { contactAction } from "../actions/index";
import { ServiceHandle } from "../helper";
import { convertToQuery } from "../helper/helper";
const _ = require("lodash");
// selector Function used to access reducer states
export function* getContactAsync(action) {
    const url = "contact/" + convertToQuery(action.params);

    try {
        const response = yield call(ServiceHandle.get, url);

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(contactAction.getContactFailed(response.errorMessage));
        } else {
            yield put(contactAction.getContactSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* SendContactAsync(action) {
    const url = "contact/" + action.params.id + "/";
    // const url = "contact/25/";
    try {
        const response = yield call(ServiceHandle.patch, url, { nickname: action.params.nickname });

        if (response.error && !_.isEmpty(response.errorMessage)) {
            yield put(contactAction.SendContactFailed(response.errorMessage));
        } else {
            yield put(contactAction.SendContactSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* addAsync(action) {
    let url = "contact/";
    try {
        const response = yield call(ServiceHandle.post, url, action.params.param);
        if (response.error) {
            yield put(contactAction.addFailed(response.errorMessage[0]));
        } else {
            const params = {
                of_user__id: action.params.userId
            };
            yield put(contactAction.getContactRequest(params));
            yield put(contactAction.addSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* DeleteContactAsync(action) {
    const url = "contact/" + action.params + "/";
    // try {
    //     const response = yield call(ServiceHandle.delete, url, action.params);

    //     if (response.error && !_.isEmpty(response.errorMessage)) {
    //         yield put(contactAction.DeleteContactFailed(response.errorMessage));
    //     } else {
    //         yield put(contactAction.DeleteContactSuccess(response));
    //     }
    // } catch (error) {
    //     console.log("ERRRORR", error);
    // }

    try {
        const response = yield call(ServiceHandle.delete, url);
        if (response.error) {
            yield put(contactAction.DeleteContactFailed(response.errorMessage));
        } else {
            yield put(contactAction.DeleteContactSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* finderAsync(action) {
    let url = "user/" + convertToQuery(action.params);
    try {
        const response = yield call(ServiceHandle.get, url);
        if (response.error) {
            action.params.type
                ? yield put(contactAction.getTeacherFailed(response.errorMessage))
                : yield put(contactAction.finderFailed(response.errorMessage));
        } else {
            action.params.type
                ? yield put(contactAction.getTeacherSuccess(response.response))
                : yield put(contactAction.finderSuccess(response.response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* sendFavoriteAsync(action) {
    const url = "contact/" + convertToQuery(action.params) + "&is_like=true";
    try {
        const response = yield call(ServiceHandle.get, url);
        if (response.error) {
            yield put(contactAction.sendFavoriteFailed(response.errorMessage));
        } else {
            yield put(contactAction.sendFavoriteSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* detailContactAsync(action) {
    const url = "contact/" + action.params + "/";
    try {
        const response = yield call(ServiceHandle.get, url, action.params);
        if (response.error) {
            yield put(contactAction.detailsContacntFailed(response.errorMessage));
        } else {
            yield put(contactAction.detailsContacntSuccess(response));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
