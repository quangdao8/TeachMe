// import RNAccountKit, { Color, StatusBarStyle } from "react-native-facebook-account-kit";
const _ = require("lodash");

export function checkValid(refs) {
    const keys = Object.keys(refs);
    for (const key of keys) {
        const inputRef = refs[key];
        const validateResults = inputRef.validateInput();
        if (!_.isEmpty(validateResults)) {
            return validateResults[0];
        }
    }
    return null;
}

export function convertToQuery(param) {
    return (
        "?" +
        Object.keys(param)
            .map(function(key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(param[key]);
            })
            .join("&")
    );
}

export function openAccountKit(phoneNumber, cca2, onSuccess = () => {}, onError = () => {}) {
    // RNAccountKit.configure({
    //     responseType: "token",
    //     initialPhoneNumber: phoneNumber ? phoneNumber : "",
    //     defaultCountry: cca2 ? cca2 : "VN",
    //     initPhoneCountryPrefix: "+84",
    //     receiveSMS: false
    // });
    // RNAccountKit.loginWithPhone().then(
    //     token => {
    //         if (token) {
    //             onSuccess(token);
    //         } else {
    //             onError("error");
    //         }
    //     },
    //     error => onError(error)
    // );
}
