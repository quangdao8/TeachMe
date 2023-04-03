import * as types from "../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: ""
};

export function localNotificationReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.CLOSE_LOCAL_NOTIFICATION) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.OPEN_LOCAL_NOTIFICATION) {
        return {
            ...state,
            data: action.response
        };
    }
    return state;
}
