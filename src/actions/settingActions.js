import * as types from "./types";

export function switchVibration(params) {
    return {
        type: types.SWITCH_VIBRATION,
        params
    };
}

export function switchVibrationCall(params) {
    return {
        type: types.SWITCH_VIBRATION_CALL,
        params
    };
}

export function switchSound(params) {
    return {
        type: types.SWITCH_SOUND,
        params
    };
}

export function switchSoundCall(params) {
    return {
        type: types.SWITCH_SOUND_CALL,
        params
    };
}

export function switchMessageNoti(params) {
    return {
        type: types.SWITCH_MESSAGE_NOTI,
        params
    };
}

export function switchGroupNoti(params) {
    return {
        type: types.SWITCH_GROUP_NOTI,
        params
    };
}

export function switchOnlineStatus(params) {
    return {
        type: types.SWITCH_ONLINE_STATUS,
        params
    };
}
