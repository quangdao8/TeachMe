import * as types from "../types";
import { ServiceHandle } from "helper";
import { CHAT_HISTORIES, CHAT_ROOM, CHAT_HISTORIES_SEARCH } from "helper/Consts";
import { convertToQuery } from "helper/helper";

export function chatHistoriesRequest(params) {
    return {
        type: types.CHAT_HISTORIES_REQUEST,
        params
    };
}

export function chatHistoriesFailed(error) {
    return {
        type: types.CHAT_HISTORIES_FAILED,
        error
    };
}

export function chatHistoriesSuccess(response, page) {
    return {
        type: types.CHAT_HISTORIES_SUCCESS,
        response
    };
}

// UPDATE LAST MESSAGE:
export async function updateLastMessage(params) {
    let url = `${CHAT_ROOM}${params.id}/`;
    const response = await ServiceHandle.patch(url, params.body);
    return response;
}

// UPDATE LAST SEEN MESSAGE
export async function updateLastSeenMessage(params) {
    let url = `${CHAT_HISTORIES}${params.id}/`;
    const response = await ServiceHandle.patch(url, params.body);
    return response;
}

// CREATE CHAT ROOM
export async function createdGroupChat(params) {
    let url = `${CHAT_HISTORIES}`;
    const response = await ServiceHandle.post(url, params);
    return response;
}

// SEARCH CHAT ROOM
export async function searchGroupChat(params) {
    let url = `${CHAT_HISTORIES_SEARCH}${convertToQuery(params)}`;
    const response = await ServiceHandle.get(url);
    return response;
}

// DELETE CHAT ROOM
export async function deleteGroupChat(params) {
    let url = `${CHAT_HISTORIES}${params.id}/`;
    const response = await ServiceHandle.patch(url, params.body);
    return response;
}

export function chatRoomCurrentRequest(params) {
    return {
        type: types.CHAT_ROOM_CURRENT_REQUEST,
        params
    };
}

export function chatRoomCurrentFailed(error) {
    return {
        type: types.CHAT_ROOM_CURRENT_FAILED,
        error
    };
}

export function chatRoomCurrentSuccess(response) {
    return {
        type: types.CHAT_ROOM_CURRENT_SUCCESS,
        response
    };
}

export function chatRoomCurrentRemove() {
    return {
        type: types.CHAT_ROOM_CURRENT_REMOVE
    };
}

export function sendNotiForOther(data) {
    // data.noti.badge = 11;
    ServiceHandle.post("send_notification/", data).then(res => console.log(res));

    // const body = {
    //     registration_ids: data.notificationId,
    //     priority: "high",
    //     content_available: true,
    //     notification: data.noti,
    //     data: data.message,
    //     collapse_key: "type_a"
    // };
    // fetch("https://fcm.googleapis.com/fcm/send", {
    //     method: "POST",
    //     headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //         Authorization:
    //             "key=AAAAhLy9zkM:APA91bFljYBsI08vjCu-J3AN3zFo5dYF8Eq83ojS3mtezWUPWD8D6MDjn7oYnSwdTukrrhTTiHWu8FshnjLm7FTxPu_T4HARGpKwUOELmuywMEFAjS_vQAKZItiqriYXclW8HaFc_Ccn"
    //     },
    //     body: JSON.stringify(body)
    // })
    //     .then(response => {
    //         console.log("sendNotiForOther ======>", response);
    //     })
    //     .catch(error => {
    //         console.log("error", error);
    //     });
}

export function changeNameGroupChat(id, body) {
    let url = `${CHAT_ROOM}${id}/`;
    const response = ServiceHandle.patch(url, body);
    return response;
}

export function addMemberToChat(id, body) {
    let url = `${CHAT_ROOM}${id}/add_user/`;
    const response = ServiceHandle.post(url, body);
    return response;
}

export function leaveGroupChat(chatRoomId, userId) {
    let url = `${CHAT_ROOM}${chatRoomId}/${userId}/`;
    const response = ServiceHandle.delete(url);
    return response;
}

export function chatHistoriesGroupRequest(params) {
    return {
        type: types.CHAT_HISTORIES_GROUP_REQUEST,
        params
    };
}

export function chatHistoriesGroupFailed(error) {
    return {
        type: types.CHAT_HISTORIES_GROUP_FAILED,
        error
    };
}

export function chatHistoriesGroupSuccess(response, page) {
    return {
        type: types.CHAT_HISTORIES_GROUP_SUCCESS,
        response
    };
}
export function getChatRoomDetail(id) {
    let url = `${CHAT_ROOM}/${id}/`;
    const response = ServiceHandle.get(url);
    return response;
}
// GET DELETED TIME
export function getDeletedTime(params) {
    let url = `${CHAT_HISTORIES}` + convertToQuery(params);
    const response = ServiceHandle.get(url);
    return response;
}

export function deletedMessRoomRequest(params) {
    return {
        type: types.DELETE_MESS_ROOM_REQUEST,
        params
    };
}
