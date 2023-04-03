import * as types from "../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: ""
};

export function allContactAppReducer(state = initialState, action) {
    state.type = action.type;

    if (action.type === types.GET_CONTACT_APP_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.GET_CONTACT_APP_SUCCESS) {
        return {
            ...state,
            data: action.response
        };
    }
    return state;
}
