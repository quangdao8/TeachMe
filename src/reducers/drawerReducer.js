/* eslint-disable import/prefer-default-export */
import * as types from "../actions/types";
import { Const, I18n } from "../helper/index";

const initialState = {
    drawerOpen: false,
    type: ""
};

export function drawerReducer(state = initialState, action) {
    if (action.type === types.DRAWER_CLOSE) {
        return {
            drawerOpen: false
        };
    }
    if (action.type === types.DRAWER_OPEN) {
        state.type = action.type;
        return {
            drawerOpen: true
        };
    }
    return state;
}
