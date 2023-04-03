import * as types from "../types";

export function requestConfirmCode(params) {
    return {
        type: types.CONFIRM_CODE_REQUEST,
        params
    };
}

export function confirmCodeFailed(error) {
    return {
        type: types.CONFIRM_CODE_FAILED,
        error
    };
}

export function confirmCodeSuccess(response) {
    return {
        type: types.CONFIRM_CODE_SUCCESS,
        response
    };
}
