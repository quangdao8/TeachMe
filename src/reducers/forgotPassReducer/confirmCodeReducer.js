import * as types from "../../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: ""
};

export function confirmCodeReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.CONFIRM_CODE_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.CONFIRM_CODE_SUCCESS) {
        return {
            ...state,
            data: action.response
        };
    }
    return state;
}
