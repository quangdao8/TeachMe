import * as types from "../actions/types";

const initialState = {
    language: "vi"
};

export function languageReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.CHANGE_LANGUAGE) {
        return {
            ...state,
            language: action.language,
            errorMessage: "",
            error: false
        };
    }
    return state;
}

export default languageReducer;
