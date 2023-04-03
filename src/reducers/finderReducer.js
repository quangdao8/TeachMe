/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: "",
    error: false
};

export function finderReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.FINDER_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            data: null,
            error: true
        };
    }
    if (action.type === types.FINDER_SUCCESS) {
        return {
            ...state,
            data: action.response,
            errorMessage: "",
            error: false
        };
    }
    return state;
}
