import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Dimensions, Platform, StatusBar } from "react-native";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { PERMISSIONS, RESULTS } from "react-native-permissions";

// export const HOST = "http://112.213.94.138/yo/api/";
// export const HOST = "http://192.168.0.111:3000/api/";
// export const HOST = "http://112.213.94.138/yo/api/";
// export const HOST_IMAGE = "http://112.213.94.138/yo";
// export const HOST_NODE_SERVER = "http://192.168.0.111:3000/";

export const HOST_NODE_SERVER = "https://us-central1-yoteacher-ac1f9.cloudfunctions.net/app/";
export const HOST = "http://172.20.10.2:3000/api/";
export const HOST_IMAGE = "http://172.20.10.2:3000";

export const SECRET_KEY = "YoTeacherSecretKey";
// export const VERSION = "1.0(20.9)";
export const VERSION = "1.5(01)";

export const PRICE_PER_MINUTE = 1000;

export const CHECK_PHONE_API = "checkPhoneNumber/";
export const REQUEST_CODE_API = "resetPasswordViaEmail/";
export const CONFIRM_CODE_API = "verifyCode/";
export const RESET_PASS_API = "updatePassword/";
export const REGISTER = "user/";
export const GET_CONTACT_API = "contact/";
export const GET_MAP_TEACHER_API = "user/";
// chat
export const CHAT_HISTORIES = "chatRoomUser/";
export const CHAT_ROOM = "chatRoom/";
export const CHAT_HISTORIES_SEARCH = "chatRoomUserSearch/";

// end chat
export const TRANSACTION = "transaction/";
// export const HOST = 'http://api.regallogistics.com/TMSStaging_new';
export const URL = `${HOST}/TMS_WebServices.asmx`;

export const LANGUAGE_ENGLISH = "en";
export const LANGUAGE_VIETNAM = "vi";

export const DEVICE = {
    DEVICE_WIDTH: Dimensions.get("window").width,
    DEVICE_HEIGHT: Dimensions.get("window").height
};
// Consts
export const FONT_SIZE = {
    CONTENT_SIZE: responsiveFontSize(1.4),
    INFO_SIZE: responsiveFontSize(1.2),
    HEADER: responsiveFontSize(2.3),
    TITLE: responsiveFontSize(2.5),
    ICON: Platform.OS == "ios" ? responsiveFontSize(5) : responsiveFontSize(5),
    INPUT: responsiveFontSize(2.0)
};

export const STRING = {
    userName: "User name",
    password: "Password",
    NOTI: "notification"
};

export const LOCAL_STORAGE = {
    DEVICE_TOKEN: "DEVICE_TOKEN",
    MISSED_CALLS_SEEN: "MISSED_CALLS_SEEN",
    VOIP_TOKEN: "VOIP_TOKEN"
};

export const PD = {
    PADDING_1: 4,
    PADDING_2: 8,
    PADDING_3: 12,
    PADDING_4: 16,
    PADDING_5: 20,
    PADDING_6: 24
};

export const DIMENSION = {
    INPUT_HEIGHT: DEVICE.DEVICE_HEIGHT < 700 ? 45 : 55,
    INPUT_RADIUS: DEVICE.DEVICE_HEIGHT < 700 ? 22.5 : 27.5,
    BUTTON_HEIGHT: DEVICE.DEVICE_HEIGHT < 700 ? 45 : 55,
    BUTTON_RADIUS: DEVICE.DEVICE_HEIGHT < 700 ? 22.5 : 27.5,
    H1: DEVICE.DEVICE_WIDTH * 0.35,
    H2: DEVICE.DEVICE_WIDTH * 0.28,
    H3: DEVICE.DEVICE_WIDTH * 0.23,
    MAP_BOTTOM_BAR_HEIGHT: DEVICE.DEVICE_HEIGHT * 0.075,
    MAP_SUBJECT_BTN_WIDTH: DEVICE.DEVICE_WIDTH * 0.2,
    // chat
    CHAT_BUBBLE_WIDTH: DEVICE.DEVICE_WIDTH * 0.65,
    CHAT_AVATAR_WIDTH: DEVICE.DEVICE_WIDTH * 0.12,
    // header
    STATUS_BAR_HEIGHT: Platform.OS === "ios" ? getStatusBarHeight(isIphoneX()) : StatusBar.currentHeight,
    HEADER_HEIGHT: 55
};

export const INPUT_TYPE = {
    EMAIL: "EMAIL",
    PASSWORD: "PASSWORD",
    PHONE_NUMBER: "PHONE_NUMBER",
    PHONE_EMAIL: "PHONE_EMAIL"
};

export const STATUS_CODE = {
    SUCCESS: [200, 201, 204],
    AUTH: [401],
    NOTFOUND: [404]
};

export const GENDER = {
    MALE: 0,
    FEMALE: 1,
    OTHER: 2
};

export const CHECK = {
    LEARNER: 0,
    TEACHER: 1
};

export const VERIFY_TYPE = {
    REGISTER: "register",
    RESET: "reset"
};

export const CHAT_TYPE = {
    TEXT: 0,
    IMAGE: 1,
    FILE: 2,
    LOCATION: 3,
    CONTACT: 4,
    CHANGE_NAME: 5,
    ADD_MEMBER: 6,
    LEAVE_ROOM: 7,
    DELETE_MESSAGE: 8,
    EDITED_MESSAGE: 9,
    IMAGES: 10,
    REPLY: 11,
    CREATE_ROOM: 12
};

export const GROUP_TYPE = {
    PRIVATE: 0,
    GROUP: 1
};

export const USER_TYPE = {
    STUDENT: 0,
    TEACHER: 1
};

export const ALERT_TYPE = {
    SUCCESS: "SUCCESS",
    INFO: "INFO",
    ERROR: "ERROR",
    WARNING: "WARING"
};

export const firebaseKey =
    "key=AAAAK1XIPFg:APA91bE4ljmbQQSqWk88rQL_U-ppFN1CQqvZ7VrD8RnCCzYZ0BOUjCgB7vPZGycagUW0gfxc5LHsUvbLWcjNe-QXbgLn23V6-N6nGcXHdwvIEN33DqYHQQmweckJqB1msC_VazIy-If0";

export const configurationTurnServer = {
    configuration: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    },
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
            // url: "turn:34.80.76.199:2233",
            // credential: "admin1234",
            // username: "admin"
        }
    ]
};
export const CALLING_ACTION = {
    DIALING: "dialing",
    BUSY: "busy",
    FINISHED: "finished",
    CONNECTED: "connected"
};
export const permissions = {
    MICROPHONE: Platform.OS === "ios" ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO,
    CAMERA: Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
    LOCATION: Platform.OS === "ios" ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PHOTO_LIBRARY: Platform.OS === "ios" ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ANDROID_WRITE_STORAGE: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
};

export const resultPermission = {
    UNAVAILABLE: RESULTS.UNAVAILABLE,
    BLOCKED: RESULTS.BLOCKED,
    DENIED: RESULTS.DENIED,
    GRANTED: RESULTS.GRANTED
};

export const GOOGLEMAP_API = "AIzaSyBDOtpdyd869avqGCzQD9wR8Q_-bYK7VcQ";
