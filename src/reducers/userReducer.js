/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
const _ = require("lodash");
const PAGE_LIMIT = 10;

const initialState = {
    data: {},
    dataSearch: {},
    dataTransactions: [],
    dataTransactionsFull: [],
    type: "",
    errorMessage: ""
};

function convertData(state, action) {
    let { count, results } = action.response;
    let numberOfPage = count / PAGE_LIMIT;
    let dataReturn = {};
    if (_.isNull(action.response.previous)) {
        dataReturn = {
            results: results,
            numberOfPage
        };
    } else {
        dataReturn = {
            results: _.concat(...state.dataSearch.results, results),
            numberOfPage
        };
    }
    return dataReturn;
}

export function userReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.LOGIN_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            data: null
        };
    }
    if (action.type === types.LOGIN_SUCCESS) {
        return {
            ...state,
            data: action.response,
            errorMessage: null
        };
    }
    if (action.type === types.LOGOUT_REQUEST) {
        return {
            ...state,
            data: null,
            dataTransactions: [],
            dataTransactionsFull: [],
            errorMessage: null
        };
    }
    if (action.type === types.PROFILE_EDIT_FAILED) {
        return {
            ...state,
            errorMessage: action.error
        };
    }
    if (action.type === types.PROFILE_EDIT_SUCCESS) {
        return {
            ...state,
            data: {
                ...state.data,
                ...action.response
            },
            errorMessage: ""
        };
    }

    if (action.type === types.SEARCH_SUCCESS) {
        return {
            ...state,
            dataSearch: convertData(state, action),
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.SEARCH_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataSearch: null,
            error: true
        };
    }
    if (action.type === types.TRANSACTION_SUCCESS) {
        let dataTransactions = state.dataTransactions;
        let { count } = action.response;
        let numberOfPageDT = count / PAGE_LIMIT;
        if (_.isNull(action.response.previous)) {
            dataTransactions = action.response.results;
        } else {
            dataTransactions = _.concat(dataTransactions, action.response.results);
        }
        return {
            ...state,
            numberOfPageDT,
            dataTransactions,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.TRANSACTION_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            // dataTransactions: null,
            error: true
        };
    }
    if (action.type === types.TRANSACTION_FULL_SUCCESS) {
        let dataTransactionsFull = state.dataTransactionsFull;
        let { count } = action.response;
        let numberOfPage = count / PAGE_LIMIT;
        if (_.isNull(action.response.previous)) {
            dataTransactionsFull = action.response.results;
        } else {
            dataTransactionsFull = _.concat(dataTransactionsFull, action.response.results);
        }
        return {
            ...state,
            numberOfPage,
            dataTransactionsFull,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.TRANSACTION_FULL_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            // dataTransactionsFull: null,
            error: true
        };
    }
    if (action.type === types.HAS_CALL) {
        return {
            ...state,
            errorMessage: "",
            dataCall: action.data
        };
    }
    if (action.type === types.END_CALL) {
        return {
            ...state,
            errorMessage: "",
            dataCall: {}
        };
    }
    return state;
}
