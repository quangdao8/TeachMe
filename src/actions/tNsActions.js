import * as types from "./types";

export function topicRequest(params) {
    return {
        type: types.TOPIC_REQUEST,
        params
    };
}

export function topicFailed(error) {
    return {
        type: types.TOPIC_FAILED,
        error
    };
}

export function topicSuccess(response) {
    return {
        type: types.TOPIC_SUCCESS,
        response
    };
}

export function specializeRequest(params) {
    return {
        type: types.SPECIALIZE_REQUEST,
        params
    };
}

export function specializeFailed(error) {
    return {
        type: types.SPECIALIZE_FAILED,
        error
    };
}

export function specializeSuccess(response) {
    return {
        type: types.SPECIALIZE_SUCCESS,
        response
    };
}
// position
export function positionRequest(params) {
    return {
        type: types.POSITION_REQUEST,
        params
    };
}

export function positionFailed(error) {
    return {
        type: types.POSITION_FAILED,
        error
    };
}

export function positionSuccess(response) {
    return {
        type: types.POSITION_SUCCESS,
        response
    };
}
// school
export function schoolRequest(params) {
    return {
        type: types.SCHOOL_REQUEST,
        params
    };
}

export function schoolFailed(error) {
    return {
        type: types.SCHOOL_FAILED,
        error
    };
}

export function schoolSuccess(response) {
    return {
        type: types.SCHOOL_SUCCESS,
        response
    };
}
// masterSettings
export function masterSettingRequest(params) {
    return {
        type: types.MASTER_SETTING_REQUEST,
        params
    };
}

export function masterSettingFailed(error) {
    return {
        type: types.MASTER_SETTING_FAILED,
        error
    };
}

export function masterSettingSuccess(response) {
    return {
        type: types.MASTER_SETTING_SUCCESS,
        response
    };
}
