import * as types from "../types";

export function saveChatMessage(params) {
    return {
        type: types.SAVE_CHAT_MESSAGE,
        params
    };
}
