// export action creators
import * as types from "./types";

import * as userActions from "./userActions";
import * as registerActions from "./registerActions";
import * as loginActions from "./loginActions";
import * as checkPhoneAction from "./forgotPassAction/checkPhoneAction";
import * as requestCodeAction from "./forgotPassAction/requestCodeAction";
import * as confirmCodeAction from "./forgotPassAction/confirmCodeAction";
import * as resetPassAction from "./forgotPassAction/resetPassAction";
import * as subjectAction from "./subjectAction";
import * as alertActions from "./alertActions";
// chat
import * as chatHistoriesAction from "./chat/chatHistoriesAction";
// end chat
import * as contactAction from "./contactActions";
// call
import * as callActions from "./callActions";

// call
import * as drawerActions from "./drawerActions";

// notification
import * as localNotificationActions from "./localNotificationActions";

// tNs
import * as tNsActions from "./tNsActions";
// search teacher in map
import * as teacherAction from "./teacherAction";
// Lang

import * as langAction from "./langAction";
// setting
import * as settingActions from "./settingActions";
//favorite
import * as favoriteAction from "./favoriteAction";
import * as allContactAppAction from "./allContactAppAction";
export {
    userActions,
    registerActions,
    types,
    loginActions,
    subjectAction,
    checkPhoneAction,
    requestCodeAction,
    confirmCodeAction,
    resetPassAction,
    alertActions,
    contactAction,
    // chat
    chatHistoriesAction,
    // end chat
    callActions,
    // drawer Action
    drawerActions,
    localNotificationActions,
    // tNs
    tNsActions,
    teacherAction,
    // Lang
    langAction,
    // setting
    settingActions,
    //favorite
    favoriteAction,
    allContactAppAction
};
