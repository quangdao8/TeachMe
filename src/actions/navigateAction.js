import * as types from "./types";

export function onNavigate(screen, roomId) {
    return {
        type: types.ON_NAVIGATE,
        screen,
        roomId
    };
}

export function navigateTo() {
    return {
        type: types.NAVIGATE_TO,
        screen: "",
        roomId: -1
    };
}
