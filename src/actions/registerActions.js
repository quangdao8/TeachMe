import * as types from "./types";
import { ServiceHandle, Const } from "helper";

export function sendRegisterRequest(params) {
    return {
        type: types.SEND_REGISTER_REQUEST,
        params
    };
}

export function sendRegisterFailed(error) {
    return {
        type: types.SEND_REGISTER_FAILED,
        error
    };
}

export function sendRegisterSuccess(response) {
    return {
        type: types.SEND_REGISTER_SUCCESS,
        response
    };
}

export async function checkPhoneExist(params) {
    let response = await ServiceHandle.post(Const.CHECK_PHONE_API, params);
    return response
}

