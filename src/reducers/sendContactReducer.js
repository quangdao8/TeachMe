import * as types from "../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: ""
};

export function sendContactReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.SEND_CONTACT_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.SEND_CONTACT_SUCCESS) {
        return {
            ...state,
            data: action.response
        };
    }
    return state;
}
