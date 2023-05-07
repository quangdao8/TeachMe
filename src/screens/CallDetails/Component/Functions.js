import { Images } from "assets";
import { CHAT_TYPE } from "helper/Consts";
import I18n from "helper/locales";

const _ = require("lodash");

export const createGroupName = (name, users, localUserId, dataContact) => {
    let groupName = "";
    let avatar = Images.DEFAULT_AVATAR;
    for (const i in users) {
        if (users[i].id != localUserId) {
            const { first_name, last_name } = users[i].user;
            // group name
            if (_.isEmpty(name)) {
                if (users.length - 1 == i || users.length < 3) {
                    let index = _.findIndex(dataContact, function(o) {
                        return o.about_user.id == users[i].id;
                    });
                    if (index > -1) {
                        groupName += dataContact[index].nickname;
                    } else {
                        groupName += `${first_name} ${last_name}`;
                    }
                } else {
                    groupName += `${first_name} ${last_name}, `;
                }
            } else {
                groupName = name;
            }
            // avatar
            if (!_.isEmpty(users.avatar)) {
                avatar = { uri: users.avatar };
            }
        }
    }
    return { groupName, avatar };
};

function convertArray(listGroup, userReducer) {
    let mainArray = [];
    for (let i in listGroup) {
        let { chat_room } = listGroup[i];
        let { users } = chat_room;
        for (const j in users) {
            if (users[j].id != userReducer.id) {
                let user = Object.assign({}, listGroup[i]);
                user.chat_room.userFind = users[j].user.first_name + " " + users[j].user.last_name;
                mainArray.push(user);
                break;
            }
        }
    }
    return mainArray;
}

export const localSearch = async (listGroup, userReducer, e) => {
    let searchArray = await convertArray(listGroup, userReducer);
    let mainArray = [];
    for (let i in searchArray) {
        let { chat_room } = searchArray[i];
        if (
            _.includes(chat_room.name.toLowerCase(), e.toLowerCase()) ||
            _.includes(chat_room.last_message.toLowerCase(), e.toLowerCase()) ||
            _.includes(chat_room.userFind.toLowerCase(), e.toLowerCase())
        ) {
            mainArray.push(searchArray[i]);
        }
    }
    return mainArray;
};

export function covertMessage(messageType, chatRoom, lastMessage, userId) {
    let message = "";
    let { users } = chatRoom;
    let lastMessageUserId = chatRoom.last_message_user_id;
    let lastUserName = "";
    if (userId == lastMessageUserId) {
        lastUserName = I18n.t("chat.you");
    } else {
        for (const i in users) {
            if (users[i].id == lastMessageUserId) {
                lastUserName = users[i].user.first_name + " " + users[i].user.last_name;
            }
        }
    }
    switch (messageType) {
        case CHAT_TYPE.IMAGE:
            message = lastUserName + I18n.t("chat.imageType");
            break;
        case CHAT_TYPE.IMAGES:
            message = lastUserName + I18n.t("chat.imagesType");
            break;
        case CHAT_TYPE.FILE:
            message = lastUserName + I18n.t("chat.fileType");
            break;
        case CHAT_TYPE.LOCATION:
            message = lastUserName + I18n.t("chat.locationType");
            break;
        case CHAT_TYPE.REPLY:
            message = lastUserName + I18n.t("chat.replyType");
            break;
        case CHAT_TYPE.DELETE_MESSAGE:
            message = lastUserName + I18n.t("chat.deleteType");
            break;
        default:
            message = lastMessage;
            break;
    }
    return message;
}
