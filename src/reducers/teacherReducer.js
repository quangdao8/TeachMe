import * as types from "../actions/types";
const initialState = {
    data: {},
    type: "",
    errorMessage: "",
    error: false
};

export function searchMapTeacherReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.GET_MAP_TEACHER_SUCCESS) {
        return {
            ...state,
            dataMapTeacher: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.GET_MAP_TEACHER_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataMapTeacher: null,
            error: true
        };
    }
    return state;
}
