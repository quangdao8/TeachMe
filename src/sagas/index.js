/* eslint-disable import/order */
import { takeEvery, all } from "redux-saga/effects";
import * as userSaga from "./userSaga";
import * as registerSaga from "./registerSaga";
import * as subjectSaga from "./subjectSaga";
import * as types from "actions/types";
import * as forgotPassSaga from "./forgotPassSaga";
import * as contactSaga from "./contactSaga";
import * as chatHistoriesSaga from "./chat/chatHistoriesSaga";
// call
import * as callSaga from "./callSaga";
// profile
import * as tNsSaga from "./tNsSaga";
import * as teacherSaga from "./teacherSaga";
//
import * as favoriteSaga from "./favoriteSaga";
import * as allContactAppSaga from "./allContactAppSaga";

export default function* watch() {
    // login
    yield all([takeEvery(types.LOGIN_REQUEST, userSaga.loginAsync)]);

    // forgot pass
    yield all([takeEvery(types.CHECK_PHONE_REQUEST, forgotPassSaga.checkPhoneAsync)]);
    yield all([takeEvery(types.REQUEST_CODE_REQUEST, forgotPassSaga.requestCodeAsync)]);
    yield all([takeEvery(types.CONFIRM_CODE_REQUEST, forgotPassSaga.confirmCodeAsync)]);
    yield all([takeEvery(types.RESET_PASS_REQUEST, forgotPassSaga.resetPassAsync)]);

    // register
    yield all([takeEvery(types.SEND_REGISTER_REQUEST, registerSaga.registerAsync)]);
    yield all([takeEvery(types.SUBJECT_REQUEST, subjectSaga.subjectAsync)]);

    // chat
    yield all([takeEvery(types.CHAT_HISTORIES_REQUEST, chatHistoriesSaga.chatHistoriesAsync)]);
    yield all([takeEvery(types.CHAT_ROOM_CURRENT_REQUEST, chatHistoriesSaga.chatRoomCurrentAsync)]);
    yield all([takeEvery(types.CHAT_HISTORIES_GROUP_REQUEST, chatHistoriesSaga.chatHistoriesGroupAsync)]);

    // end chat
    // logout

    yield all([takeEvery(types.GET_CONTACT_REQUEST, contactSaga.getContactAsync)]);
    //contact
    yield all([takeEvery(types.SEND_CONTACT_REQUEST, contactSaga.SendContactAsync)]);
    yield all([takeEvery(types.DELETE_CONTACT_REQUEST, contactSaga.DeleteContactAsync)]);
    // find
    yield all([takeEvery(types.FINDER_REQUEST, contactSaga.finderAsync)]);
    yield all([takeEvery(types.GET_TEACHER_REQUEST, contactSaga.finderAsync)]);
    // add
    yield all([takeEvery(types.ADD_REQUEST, contactSaga.addAsync)]);
    //
    // yield all([takeEvery(types.SEND_LIKE_REQUEST, contactSaga.sendLikeAsync)]);
    //
    yield all([takeEvery(types.CALL_HISTORY_REQUEST, callSaga.callerAsync)]);
    yield all([takeEvery(types.CALL_DETAILS_REQUEST, callSaga.callerDetailAsync)]);
    //
    yield all([takeEvery(types.SEND_FAVORITE_REQUEST, contactSaga.sendFavoriteAsync)]);
    yield all([takeEvery(types.DETAIL_CONTACT_REQUEST, contactSaga.detailContactAsync)]);
    // tNs
    yield all([takeEvery(types.PROFILE_EDIT_REQUEST, userSaga.profileEditAsync)]);
    yield all([takeEvery(types.TOPIC_REQUEST, tNsSaga.tNsAsync)]);
    yield all([takeEvery(types.SPECIALIZE_REQUEST, tNsSaga.tNsAsync)]);
    yield all([takeEvery(types.POSITION_REQUEST, tNsSaga.tNsAsync)]);
    yield all([takeEvery(types.SCHOOL_REQUEST, tNsSaga.tNsAsync)]);
    yield all([takeEvery(types.MASTER_SETTING_REQUEST, tNsSaga.tNsAsync)]);

    // search
    yield all([takeEvery(types.SEARCH_REQUEST, userSaga.searchAsync)]);
    //searchMapTeacher
    yield all([takeEvery(types.GET_MAP_TEACHER_REQUEST, teacherSaga.getMapTeacherAsync)]);
    //
    yield all([takeEvery(types.TRANSACTION_REQUEST, userSaga.transactionAsync)]);
    yield all([takeEvery(types.TRANSACTION_FULL_REQUEST, userSaga.transactionFullAsync)]);
    //
    yield all([takeEvery(types.GET_FAVORITE_TEACHER_REQUEST, favoriteSaga.getFavoriteAsync)]);
    yield all([takeEvery(types.POST_FAVORITE_TEACHER_REQUEST, favoriteSaga.sendFavoriteAsync)]);
    yield all([takeEvery(types.DELETE_FAVORITE_TEACHER_REQUEST, favoriteSaga.deleteFavoriteAsync)]);
    yield all([takeEvery(types.GET_LIST_FAVORITE_TEACHER_REQUEST, favoriteSaga.getListFavoriteAsync)]);
    // get all contact in App
    yield all([takeEvery(types.GET_CONTACT_APP_REQUEST, allContactAppSaga.getContactAppAsync)]);
}
