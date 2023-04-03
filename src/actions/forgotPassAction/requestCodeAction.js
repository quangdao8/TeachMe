import * as types from "../types";

export function requestRequestCode(params) {
    return {
        type: types.REQUEST_CODE_REQUEST,
        params
    };
}

export function requestCodeFailed(error) {
    return {
        type: types.REQUEST_CODE_FAILED,
        error
    };
}

export function requestCodeSuccess(response) {
    return {
        type: types.REQUEST_CODE_SUCCESS,
        response
    };
}
