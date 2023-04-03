import * as types from "./types";
import { ServiceHandle } from "helper";

const _ = require("lodash");

export function callHistoryRequest(params) {
    return {
        type: types.CALL_HISTORY_REQUEST,
        params
    };
}

export function callHistoryFailed(error) {
    return {
        type: types.CALL_HISTORY_FAILED,
        error
    };
}

export function callHistorySuccess(response) {
    return {
        type: types.CALL_HISTORY_SUCCESS,
        response
    };
}

export function callDetailsRequest(params) {
    return {
        type: types.CALL_DETAILS_REQUEST,
        params
    };
}

export function callDetailsFailed(error) {
    return {
        type: types.CALL_DETAILS_FAILED,
        error
    };
}

export function callDetailsSuccess(response) {
    return {
        type: types.CALL_DETAILS_SUCCESS,
        response
    };
}

// delete

export function callDeleteRequest(params) {
    return ServiceHandle.delete(`call_log_user/${params}/`);
    // return {
    //     type: types.CALL_DELETE_REQUEST,
    //     params
    // };
}

export function callDeleteFailed(error) {
    return {
        type: types.CALL_DELETE_FAILED,
        error
    };
}

export function callDeleteSuccess(response) {
    return {
        type: types.CALL_DELETE_SUCCESS,
        response
    };
}

export function callAddRequest(params, paramsHistory) {
    ServiceHandle.post(`call_log/`, params)
        .then(res => {
            callHistoryRequest(paramsHistory);
        })
        .catch(e => {
            callHistoryRequest(paramsHistory);
        });
}

export function voipPushCall(payload) {
    return ServiceHandle.voipPushCall(payload);
}

export async function postCheckBlock(id, end_time, duration, isEndCall, note_called_user, review_point) {
    const url = `checkBlock/`;
    const params = {
        call_log_id: id,
        is_end_call: isEndCall,
        duration,
        end_time
    };
    // !_.isEmpty(end_time) && (params.end_time = end_time);
    !_.isEmpty(note_called_user) && (params.note_called_user = note_called_user);
    // _.isNumber(duration) && (params.duration = duration);
    _.isNumber(review_point) && (params.review_point = review_point);
    const response = await ServiceHandle.post(url, params);
    return response;
}
