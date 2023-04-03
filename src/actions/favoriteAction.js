import * as types from "./types";
import { ServiceHandle } from "helper";

// get favorite teacher
export function getFavoriteTeacherRequest(params) {
    return {
        type: types.GET_FAVORITE_TEACHER_REQUEST,
        params
    };
}
export function getFavoriteTeacherFailed(error) {
    return {
        type: types.GET_FAVORITE_TEACHER_FAILED,
        error
    };
}
export function getFavoriteTeacherSuccess(response) {
    return {
        type: types.GET_FAVORITE_TEACHER_SUCCESS,
        response
    };
}

// post favorite teacher
export function sendFavoriteTeacherRequest(params) {
    return {
        type: types.POST_FAVORITE_TEACHER_REQUEST,
        params
    };
}
export function sendFavoriteTeacherFailed(error) {
    return {
        type: types.POST_FAVORITE_TEACHER_FAILED,
        error
    };
}
export function sendFavoriteTeacherSuccess(response) {
    return {
        type: types.POST_FAVORITE_TEACHER_SUCCESS,
        response
    };
}

// delete favorite teacher
export function deleteFavoriteTeacherRequest(params) {
    return {
        type: types.DELETE_FAVORITE_TEACHER_REQUEST,
        params
    };
}
export function deleteFavoriteTeacherFailed(error) {
    return {
        type: types.DELETE_FAVORITE_TEACHER_FAILED,
        error
    };
}
export function deleteFavoriteTeacherSuccess(response) {
    return {
        type: types.DELETE_FAVORITE_TEACHER_SUCCESS,
        response
    };
}

// get list favorite teacher
export function getListFavoriteTeacherRequest(params) {
    return {
        type: types.GET_LIST_FAVORITE_TEACHER_REQUEST,
        params
    };
}
export function getListFavoriteTeacherFailed(error) {
    return {
        type: types.GET_LIST_FAVORITE_TEACHER_FAILED,
        error
    };
}
export function getListFavoriteTeacherSuccess(response) {
    return {
        type: types.GET_LIST_FAVORITE_TEACHER_SUCCESS,
        response
    };
}
