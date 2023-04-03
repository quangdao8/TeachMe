/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
const _ = require("lodash");

const initialState = {
    data: [],
    dataDetails: {
        results: [],
        numberOfPage: 0
    },
    dataDelete: [],
    type: "",
    errorMessage: "",
    error: false
};

const PAGE_LIMIT = 10;

function convertData(state, action) {
    let { count, results, previous } = action.response;
    let numberOfPage = count / PAGE_LIMIT;
    let dataReturn = {};
    if (_.isNull(previous)) {
        dataReturn = {
            results,
            numberOfPage
        };
    } else {
        dataReturn = {
            results: _.concat(...state.dataDetails.results, results),
            numberOfPage
        };
    }
    return dataReturn;
}

export function callReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.CALL_HISTORY_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            data: null,
            error: true
        };
    }
    if (action.type === types.CALL_HISTORY_SUCCESS) {
        return {
            ...state,
            data: action.response,
            errorMessage: "",
            error: false
        };
    }
    if (action.type === types.CALL_DETAILS_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            dataDetails: {
                results: [],
                numberOfPage: 0
            },
            error: true
        };
    }
    if (action.type === types.CALL_DETAILS_SUCCESS) {
        return {
            ...state,
            dataDetails: convertData(state, action),
            errorMessage: "",
            error: false
        };
    }
    return state;
}
