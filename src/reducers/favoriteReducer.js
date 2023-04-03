/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
const initialState = {
    dataFavoriteTeacher: {},
    dataSendFavorite: {},
    dataDelete: {},
    listData: {},
    type: "",
    errorMessage: "",
    error: false
};

export function favoriteReducer(state = initialState, action) {
    state.type = action.type;

    //
    if (action.type === types.GET_FAVORITE_TEACHER_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataFavoriteTeacher: null,
            error: true
        };
    }
    if (action.type === types.GET_FAVORITE_TEACHER_SUCCESS) {
        return {
            ...state,
            dataFavoriteTeacher: action.response,
            errorMessage: "",
            error: false
        };
    }
    //
    if (action.type === types.POST_FAVORITE_TEACHER_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataSendFavorite: null,
            error: true
        };
    }
    if (action.type === types.POST_FAVORITE_TEACHER_SUCCESS) {
        return {
            ...state,
            dataSendFavorite: action.response,
            errorMessage: "",
            error: false
        };
    }
    //
    if (action.type === types.DELETE_FAVORITE_TEACHER_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataDelete: null,
            error: true
        };
    }
    if (action.type === types.DELETE_FAVORITE_TEACHER_SUCCESS) {
        return {
            ...state,
            dataDelete: action.response,
            errorMessage: "",
            error: false
        };
    }
    //
    if (action.type === types.GET_LIST_FAVORITE_TEACHER_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            listData: null,
            error: true
        };
    }
    if (action.type === types.GET_LIST_FAVORITE_TEACHER_SUCCESS) {
        return {
            ...state,
            listData: action.response,
            errorMessage: "",
            error: false
        };
    }
    return state;
}
