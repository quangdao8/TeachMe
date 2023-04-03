/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
const initialState = {
    dataTopic: [],
    dataSpecialize: [],
    dataPosition: [],
    dataSchool: [],
    dataMasterSetting: [],
    type: "",
    errorMessage: ""
};

export function tNsReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.TOPIC_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.TOPIC_SUCCESS) {
        return {
            ...state,
            dataTopic: action.response,
            errorMessage: null
        };
    }
    if (action.type === types.SPECIALIZE_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.SPECIALIZE_SUCCESS) {
        return {
            ...state,
            dataSpecialize: action.response,
            errorMessage: null
        };
    }
    if (action.type === types.POSITION_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.POSITION_SUCCESS) {
        return {
            ...state,
            dataPosition: action.response,
            errorMessage: null
        };
    }
    if (action.type === types.SCHOOL_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.SCHOOL_SUCCESS) {
        return {
            ...state,
            dataSchool: action.response,
            errorMessage: null
        };
    }
    if (action.type === types.MASTER_SETTING_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.MASTER_SETTING_SUCCESS) {
        return {
            ...state,
            dataMasterSetting: action.response,
            errorMessage: null
        };
    }
    return state;
}
