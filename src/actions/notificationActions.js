import * as types from "./types";
import { ServiceHandle } from "helper";

export function notificationActions(type,params) {
    return {
        type,
        params
    };
}