import * as types from "../../actions/types";
const _ = require("lodash");
const PAGE_LIMIT = 10;

const initialState = {
    data: {},
    type: "",
    errorMessage: "",
    success: false,
    currentRoom: {},
    dataGroup: [],
    messageRoom: []
};

function convertData(state, action) {
    let { count, results } = action.response.response;
    let { page } = action.response;
    let numberOfPage = count / PAGE_LIMIT;
    let dataReturn = {};
    if (page < 2) {
        dataReturn = {
            results: results,
            numberOfPage
        };
    } else {
        dataReturn = {
            results: _.concat(...state.data.results, results),
            numberOfPage
        };
    }
    return dataReturn;
}
function convertDataGroup(state, action) {
    let { count, results } = action.response.response;
    let { page } = action.response;
    let numberOfPage = count / PAGE_LIMIT;
    let dataReturn = {};
    if (page < 2) {
        dataReturn = {
            results: results,
            numberOfPage
        };
    } else {
        dataReturn = {
            results: _.concat(...state.dataGroup.results, results),
            numberOfPage
        };
    }
    return dataReturn;
}

export function chatHistoriesReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.CHAT_HISTORIES_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            success: false,
            data: null
        };
    }
    if (action.type === types.CHAT_HISTORIES_SUCCESS) {
        return {
            ...state,
            data: convertData(state, action),
            success: true,
            errorMessage: ""
        };
    }
    if (action.type === types.CHAT_ROOM_CURRENT_SUCCESS) {
        return {
            ...state,
            success: true,
            errorMessage: "",
            currentRoom: action.response.data
        };
    }
    if (action.type === types.CHAT_ROOM_CURRENT_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            success: false,
            currentRoom: null
        };
    }
    if (action.type === types.CHAT_ROOM_CURRENT_REMOVE) {
        return {
            ...state,
            success: true,
            errorMessage: "",
            currentRoom: null
        };
    }
    if (action.type === types.CHAT_HISTORIES_GROUP_FAILED) {
        return {
            ...state,
            errorMessage: action.error,
            success: false
        };
    }
    if (action.type === types.CHAT_HISTORIES_GROUP_SUCCESS) {
        return {
            ...state,
            // data: convertData(state, action),
            success: true,
            errorMessage: "",
            dataGroup: convertDataGroup(state, action)
        };
    }
    if (action.type === types.SAVE_CHAT_MESSAGE) {
        const data = state.messageRoom;
        const { roomId, message } = action.params;
        const index = _.findIndex(data, obj => {
            return roomId == obj.roomId;
        });

        if (index > -1) {
            data[index] = action.params;
        } else {
            data.push(action.params);
        }

        return {
            ...state,
            success: true,
            errorMessage: "",
            messageRoom: data
        };
    }
    if (action.type === types.REMOVE_CONTACT) {
        return {
            ...state,
            messageRoom: []
        };
    }
    if (action.type === types.DELETE_MESS_ROOM_REQUEST) {
        const data = state.messageRoom;
        const roomId = action.params;
        const index = _.findIndex(data, obj => {
            return roomId == obj.roomId;
        });
        if (index > -1) {
            data.splice(index, 1);
        } else {
        }

        return {
            ...state,
            success: true,
            errorMessage: "",
            messageRoom: data
        };
    }
    return state;
}
