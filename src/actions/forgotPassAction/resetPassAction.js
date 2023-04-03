import * as types from "../types";

export function requestResetPass(params) {
    return {
        type: types.RESET_PASS_REQUEST,
        params
    };
}

export function resetPassFailed(error) {
    return {
        type: types.RESET_PASS_FAILED,
        error
    };
}

export function resetPassSuccess(response) {
    return {
        type: types.RESET_PASS_SUCCESS,
        response
    };
}
