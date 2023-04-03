// get all contact in app
import * as types from "./types";
export function getContactAppRequest(params) {
    return {
        type: types.GET_CONTACT_APP_REQUEST,
        params
    };
}

export function getContactAppFailed(error) {
    return {
        type: types.GET_CONTACT_APP_FAILED,
        error
    };
}

export function getContactAppSuccess(response) {
    return {
        type: types.GET_CONTACT_APP_SUCCESS,
        response
    };
}
