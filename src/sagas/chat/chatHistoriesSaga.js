import { put, call } from "redux-saga/effects";
import { chatHistoriesAction } from "../../actions/index";
import { ServiceHandle, Const } from "../../helper";
import { convertToQuery } from "../../helper/helper";
const _ = require("lodash");

export function* chatHistoriesAsync(action) {
    let { params } = action;
    let url = `${Const.CHAT_HISTORIES}${convertToQuery(params)}`;
    try {
        const response = yield call(ServiceHandle.get, url);
        if (response.error) {
            yield put(chatHistoriesAction.chatHistoriesFailed(response.errorMessage));
        } else {
            yield put(chatHistoriesAction.chatHistoriesSuccess({ response: response.response, page: params.page }));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* chatRoomCurrentAsync(action) {
    let { params } = action;
    let url = `${Const.CHAT_ROOM}${params.id}/`;
    try {
        const response = yield call(ServiceHandle.get, url);
        if (response.error) {
            yield put(chatHistoriesAction.chatRoomCurrentFailed(response.errorMessage));
        } else {
            yield put(chatHistoriesAction.chatRoomCurrentSuccess({ data: response.response }));
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}

export function* chatHistoriesGroupAsync(action) {
    let { params } = action;
    let url = `${Const.CHAT_HISTORIES}${convertToQuery(params)}`;
    try {
        const response = yield call(ServiceHandle.get, url);
        if (response.error) {
            yield put(chatHistoriesAction.chatHistoriesGroupFailed(response.errorMessage));
        } else {
            yield put(
                chatHistoriesAction.chatHistoriesGroupSuccess({ response: response.response, page: params.page })
            );
        }
    } catch (error) {
        console.log("ERRRORR", error);
    }
}
