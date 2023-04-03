import * as types from "../types";

export function requestCheckPhone(params) {
    return {
        type: types.CHECK_PHONE_REQUEST,
        params
    };
}

export function checkPhoneFailed(error) {
    return {
        type: types.CHECK_PHONE_FAILED,
        error
    };
}

export function checkPhoneSuccess(response) {
    return {
        type: types.CHECK_PHONE_SUCCESS,
        response
    };
}
