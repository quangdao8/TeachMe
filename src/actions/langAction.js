/*
 * Reducer actions related with login
 */
import * as types from "./types";

export function changeLanguage(language) {
    return {
        type: types.CHANGE_LANGUAGE,
        language
    };
}
