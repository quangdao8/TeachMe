/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
import { Const, I18n } from "../helper/index";
import _ from "lodash";

const initialState = {
    data: {
        vibration: true,
        vibrationCall: true,
        sound: true,
        soundCall: true,
        messageNoti: true,
        groupNoti: true,
        onlineStatus: true
    },
    type: "",
    errorMessage: ""
};

export function settingReducer(state = initialState, action) {
    state.type = action.type;
    if (action.type === types.SWITCH_VIBRATION) {
        return {
            ...state,
            data: {
                ...state.data,
                vibration: action.params
            }
        };
    }
    if (action.type === types.SWITCH_VIBRATION_CALL) {
        return {
            ...state,
            data: {
                ...state.data,
                vibrationCall: action.params
            }
        };
    }
    if (action.type === types.SWITCH_SOUND) {
        return {
            ...state,
            data: {
                ...state.data,
                sound: action.params
            }
        };
    }
    if (action.type === types.SWITCH_SOUND_CALL) {
        return {
            ...state,
            data: {
                ...state.data,
                soundCall: action.params
            }
        };
    }
    if (action.type === types.SWITCH_MESSAGE_NOTI) {
        return {
            ...state,
            data: {
                ...state.data,
                messageNoti: action.params
            }
        };
    }
    if (action.type === types.SWITCH_GROUP_NOTI) {
        return {
            ...state,
            data: {
                ...state.data,
                groupNoti: action.params
            }
        };
    }
    if (action.type === types.SWITCH_ONLINE_STATUS) {
        return {
            ...state,
            data: {
                ...state.data,
                onlineStatus: action.params
            }
        };
    }
    return state;
}
