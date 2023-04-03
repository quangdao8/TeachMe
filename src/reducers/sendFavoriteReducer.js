import * as types from "../actions/types";
const initialState = {
    dataFavorite: [],
    type: "",
    errorMessage: "",
    error: false
};

export function sendFavoriteReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.SEND_FAVORITE_SUCCESS) {
        return {
            ...state,
            dataFavorite: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.SEND_FAVORITE_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataFavorite: null,
            error: true
        };
    }
    return state;
}
