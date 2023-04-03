import * as types from "./types";

export function getMapTeacherRequest(params) {
    return {
        type: types.GET_MAP_TEACHER_REQUEST,
        params
    };
}

export function getMapTeacherFailed(error) {
    return {
        type: types.GET_MAP_TEACHER_FAILED,
        error
    };
}

export function getMapTeacherSuccess(response) {
    return {
        type: types.GET_MAP_TEACHER_SUCCESS,
        response
    };
}
