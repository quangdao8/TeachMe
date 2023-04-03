import * as types from "../../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: ""
};

export function resetPassReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.RESET_PASS_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.RESET_PASS_SUCCESS) {
        return {
            ...state,
            data: action.response
        };
    }
    return state;
}
