/*
 * Reducer actions related with login
 */
import * as types from "./types";

export function closeAlert() {
    return {
        type: types.ALERT_CLOSE
    };
}

export function openAlert(params) {
    return {
        type: types.ALERT_OPEN,
        params
    };
}

export function openModal(params) {
    return {
        type: types.MODAL_OPEN,
        params
    };
}

export function closeModal() {
    return {
        type: types.MODAL_CLOSE
    };
}
