import * as types from "../../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: ""
};

export function checkPhoneReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.CHECK_PHONE_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.CHECK_PHONE_SUCCESS) {
        return {
            ...state,
            data: action.response
        };
    }
    return state;
}
