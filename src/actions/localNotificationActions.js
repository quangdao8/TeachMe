import * as types from "./types";

export function openNotification(params) {
    return {
        type: types.OPEN_LOCAL_NOTIFICATION,
        params
    };
}

export function closeNotification(params) {
    return {
        type: types.CLOSE_LOCAL_NOTIFICATION,
        params
    };
}
