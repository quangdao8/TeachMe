import * as loadingReducer from "./loadingReducer";
import * as userReducer from "./userReducer";
import * as registerReducer from "./registerReducer";
import * as loginReducer from "./loginReducer";
import * as subjectReducer from "./subjectReducer";
import * as checkPhoneReducer from "./forgotPassReducer/checkPhoneReducer";
import * as requestCodeReducer from "./forgotPassReducer/requestCodeReducer";
import * as confirmCodeReducer from "./forgotPassReducer/confirmCodeReducer";
import * as resetPassReducer from "./forgotPassReducer/resetPassReducer";

// chat
import * as chatHistoriesReducer from "./chatReducer/chatHistoriesReducer";
// end chat
import * as contactReducer from "./contactReducer";
import * as addReducer from "./addReducer";
import * as sendContactReducer from "./sendContactReducer";
import * as deteleContactReducer from "./deleteContactReducer";
import * as sendFavoriteReducer from "./sendFavoriteReducer";
import * as alertReducer from "./alertReducer";
// call
import * as callReducer from "./callReducer";
// drawer
import * as drawerReducer from "./drawerReducer";
import * as localNotificationReducer from "./localNotificationReducer";
// tNs
import * as tNsReducer from "./tNsReducer";
// search teacher map
import * as teacherReducer from "./teacherReducer";
// lang
import * as languageReducer from "./languageReducer";
// settings
import * as settingReducer from "./settingReducer";
import * as navigateReducer from "./navigateReducer";

import * as favoriteReducer from "./favoriteReducer";

import * as allContactAppReducer from "./allContactAppReducer";
export default Object.assign(
    loadingReducer,
    userReducer,
    loginReducer,
    checkPhoneReducer,
    requestCodeReducer,
    confirmCodeReducer,
    resetPassReducer,
    subjectReducer,
    registerReducer,
    sendContactReducer,
    contactReducer,
    deteleContactReducer,
    alertReducer,
    chatHistoriesReducer,
    sendFavoriteReducer,
    callReducer,
    drawerReducer,
    localNotificationReducer,
    // tNs
    tNsReducer,
    teacherReducer,
    languageReducer,
    // setting
    settingReducer,
    navigateReducer,
    //
    favoriteReducer,
    allContactAppReducer
);
