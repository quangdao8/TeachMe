/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: ""
};

export function loginReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.LOGIN_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.LOGIN_SUCCESS) {
        return {
            ...state,
            data: action.response
        };
    }
    return state;
}
