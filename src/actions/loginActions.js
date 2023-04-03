import * as types from "./types";

export function requestLogin(params) {
    return {
        type: types.LOGIN_REQUEST,
        params
    };
}

export function loginFailed(error) {
    return {
        type: types.LOGIN_FAILED,
        error
    };
}

export function loginSuccess(response) {
    return {
        type: types.LOGIN_SUCCESS,
        response
    };
}
