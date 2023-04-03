import * as types from "../actions/types";
const initialState = {
    data: {},
    dataFinder: {},
    dataFavorite: {},
    dataAdder: {},
    dataTeacher: {},
    type: "",
    errorMessage: "",
    error: false,
    dataDetail: {},
    localContact: []
};
const PAGE_LIMIT = 10;

const _ = require("lodash");

function convertData(state, action) {
    let { count, results } = action.response;
    let numberOfPage = count / PAGE_LIMIT;
    let dataReturn = {};
    if (_.isNull(action.response.previous)) {
        dataReturn = {
            results,
            numberOfPage
        };
    } else {
        dataReturn = {
            results: _.concat(...state.dataTeacher.results, results),
            numberOfPage
        };
    }
    return dataReturn;
}

export function contactReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.EDIT_CONTACT_LOCAL) {
        const listContact = state.data.response;
        listContact.map((n, index) => {
            if (n.id === action.params.id) {
                listContact[index] = action.params;
            }
        });
        return {
            ...state,
            type: action.type,
            data: {
                ...state.data,
                response: listContact
            }
        };
    }
    if (action.type === types.GET_CONTACT_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.GET_CONTACT_SUCCESS) {
        return {
            ...state,
            data: action.response
        };
    }
    if (action.type === types.FINDER_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataFinder: null,
            error: true
        };
    }
    if (action.type === types.FINDER_SUCCESS) {
        return {
            ...state,
            dataFinder: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.ADD_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataAdder: null,
            error: true
        };
    }
    if (action.type === types.ADD_SUCCESS) {
        return {
            ...state,
            dataAdder: action.response,
            errorMessage: "",
            error: false
        };
    }
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
    if (action.type === types.SYNC_CONTACT_SUCCESS) {
        return {
            ...state,
            error: false,
            localContact: action.data
        };
    }
    if (action.type === types.REMOVE_CONTACT) {
        return {
            ...state,
            data: {},
            dataFinder: {},
            dataFavorite: {},
            dataAdder: {},
            type: "",
            errorMessage: "",
            error: false,
            localContact: []
        };
    }
    if (action.type === types.DETAIL_CONTACT_SUCCESS) {
        return {
            ...state,
            dataDetail: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.DETAIL_CONTACT_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataDetail: null,
            error: true
        };
    }
    if (action.type === types.GET_TEACHER_SUCCESS) {
        return {
            ...state,
            dataTeacher: convertData(state, action),
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.GET_TEACHER_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataTeacher: null,
            error: true
        };
    }
    if (action.type === types.GET_DEVICE_CONTACT_REQUEST) {
        return {
            ...state,
            errorMessage: action.error,
            phoneDevice: action.params
        };
    }
    return state;
}
