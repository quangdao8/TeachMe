import * as types from "./types";
import { ServiceHandle } from "helper";

export function getContactRequest(params) {
    return {
        type: types.GET_CONTACT_REQUEST,
        params
    };
}

export function getContactFailed(error) {
    return {
        type: types.GET_CONTACT_FAILED,
        error
    };
}

export function getContactSuccess(response) {
    return {
        type: types.GET_CONTACT_SUCCESS,
        response
    };
}

// Post contact

export function SendContactRequest(params) {
    return {
        type: types.SEND_CONTACT_REQUEST,
        params
    };
}
export function SendContactFailed(error) {
    return {
        type: types.SEND_CONTACT_FAILED,
        error
    };
}

export function SendContactSuccess(response) {
    return {
        type: types.SEND_CONTACT_SUCCESS,
        response
    };
}

// delete Contact

export function DeleteContactRequest(params) {
    return {
        type: types.DELETE_CONTACT_REQUEST,
        params
    };
}

export function DeleteContactFailed(error) {
    return {
        type: types.DELETE_CONTACT_FAILED,
        error
    };
}

export function DeleteContactSuccess(response) {
    return {
        type: types.DELETE_CONTACT_SUCCESS,
        response
    };
}

// finder

export function finderRequest(params) {
    return {
        type: types.FINDER_REQUEST,
        params
    };
}

export function finderFailed(error) {
    return {
        type: types.FINDER_FAILED,
        error
    };
}

export function finderSuccess(response) {
    return {
        type: types.FINDER_SUCCESS,
        response
    };
}

// add

export function addRequest(params) {
    return {
        type: types.ADD_REQUEST,
        params
    };
}

export function addFailed(error) {
    return {
        type: types.ADD_FAILED,
        error
    };
}

export function addSuccess(response) {
    return {
        type: types.ADD_SUCCESS,
        response
    };
}

/// like

export function sendLikeRequest(params) {
    return {
        type: types.SEND_LIKE_REQUEST,
        params
    };
}
export function sendLikeFailed(error) {
    return {
        type: types.SEND_LIKE_FAILED,
        error
    };
}

export function sendLikeSuccess(response) {
    return {
        type: types.SEND_LIKE_SUCCESS,
        response
    };
}

// avatar

export function avatarRequest() {
    return {
        type: types.AVATAR_REQUEST
    };
}

export function avatarSuccess() {
    return {
        type: types.AVATAR_SUCCESS
    };
}

//

export function sendFavoriteRequest(params) {
    return {
        type: types.SEND_FAVORITE_REQUEST,
        params
    };
}
export function sendFavoriteFailed(error) {
    return {
        type: types.SEND_FAVORITE_FAILED,
        error
    };
}

export function sendFavoriteSuccess(response) {
    return {
        type: types.SEND_FAVORITE_SUCCESS,
        response
    };
}
// SYNC CONTACT
export function syncContactRequest() {
    return {
        type: types.SYNC_CONTACT_REQUEST
    };
}

export function syncContactSuccess(data) {
    return {
        type: types.SYNC_CONTACT_SUCCESS,
        data
    };
}

export function removeContact() {
    return {
        type: types.REMOVE_CONTACT
    };
}

export function editContactLocal(params) {
    return {
        type: types.EDIT_CONTACT_LOCAL,
        params
    };
}

//
export function detailsContacntRequest(params) {
    return {
        type: types.DETAIL_CONTACT_REQUEST,
        params
    };
}
export function detailsContacntFailed(error) {
    return {
        type: types.DETAIL_CONTACT_FAILED,
        error
    };
}

export function detailsContacntSuccess(response) {
    return {
        type: types.DETAIL_CONTACT_SUCCESS,
        response
    };
}

// get list teacher
export function getTeacherRequest(params) {
    return {
        type: types.GET_TEACHER_REQUEST,
        params
    };
}
export function getTeacherFailed(error) {
    return {
        type: types.GET_TEACHER_FAILED,
        error
    };
}
export function getTeacherSuccess(response) {
    return {
        type: types.GET_TEACHER_SUCCESS,
        response
    };
}
export function getDeviceContactRequest(params) {
    return {
        type: types.GET_DEVICE_CONTACT_REQUEST,
        params
    };
}
