/*
 * Reducer actions related with login
 */
import * as types from "./types";

export function closeDrawer() {
    return {
        type: types.DRAWER_CLOSE
    };
}

export function openDrawer() {
    return {
        type: types.DRAWER_OPEN
    };
}
