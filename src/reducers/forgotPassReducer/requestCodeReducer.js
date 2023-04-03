import * as types from "../../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: ""
};

export function requestCodeReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.REQUEST_CODE_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.REQUEST_CODE_SUCCESS) {
        return {
            ...state,
            data: action.response
        };
    }
    return state;
}
