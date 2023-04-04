import { Images } from "assets";
import { CHAT_TYPE } from "helper/Consts";
import I18n from "helper/locales";

const _ = require("lodash");

export function getNicknameAndAvatar(user, dataContact) {
    let nickname = user.user.first_name + " " + user.user.last_name;
    let avatar = user.avatar;
    dataContact.map(el => {
        if (el.about_user.id == user.id) {
            el.nickname ? (nickname = el.nickname) : null;
            el.avatar ? (avatar = el.avatar) : null;
            return { nickname, avatar };
        }
    });
    return { nickname, avatar };
}

export function localSearch(value, data) {}
