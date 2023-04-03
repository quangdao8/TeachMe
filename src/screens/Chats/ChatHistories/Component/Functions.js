import { Images } from "assets";
import { CHAT_TYPE, GROUP_TYPE } from "helper/Consts";
import I18n from "helper/locales";

const _ = require("lodash");
const AVATAR =
    "https://firebasestorage.googleapis.com/v0/b/yo-learner-test.appspot.com/o/yo-learn-avatar%2Fdefault_avatar.png?alt=media&token=fa92022d-e2ae-421d-a23f-04eef8f5a1df";

export const createGroupName = (name, users, localUserId, dataContact, type) => {
    let groupName = "";
    let avatar = AVATAR;

    if (_.isEmpty(name)) {
        if (type == GROUP_TYPE.PRIVATE) {
            const userIndex = _.findIndex(users, obj => {
                return obj.id != localUserId;
            });
            if (userIndex > -1) {
                const userId = users[userIndex].id;
                let contactIndex = _.findIndex(dataContact, function(o) {
                    return o.about_user.id == userId;
                });
                if (contactIndex > -1) {
                    groupName = dataContact[contactIndex].nickname;
                    if (!_.isEmpty(dataContact[contactIndex].avatar)) {
                        avatar = dataContact[contactIndex].avatar;
                    }
                } else {
                    const { first_name, last_name } = users[userIndex].user;
                    groupName = `${first_name} ${last_name}`;
                    avatar = users[userIndex].avatar;
                }
            } else {
                const myUserIndex = _.findIndex(users, obj => {
                    return obj.id == localUserId;
                });
                const { first_name, last_name } = users[myUserIndex].user;
                groupName = `${first_name} ${last_name}`;
            }
        } else {
            for (const i in users) {
                const { first_name, last_name } = users[i].user;
                if (users.length - 1 == i) {
                    let index = _.findIndex(dataContact, function(o) {
                        return o.about_user.id == users[i].id;
                    });
                    if (index > -1) {
                        groupName += dataContact[index].nickname;
                        if (!_.isEmpty(dataContact[index].avatar)) {
                            avatar = dataContact[index].avatar;
                        }
                    } else {
                        groupName += `${first_name} ${last_name}`;
                    }
                } else {
                    groupName += `${first_name} ${last_name}, `;
                }
            }
        }
    } else {
        groupName = name;
    }

    groupName = groupName.trim();
    if (groupName[groupName.length - 1] == "," && groupName.length > 0) {
        groupName = groupName.substring(0, groupName.length - 1);
    }

    if (users.length > 2) {
        avatar = [users[0].avatar, users[1].avatar, users[2].avatar];
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
        case CHAT_TYPE.CONTACT:
            message = lastUserName + I18n.t("chat.contactType");
            break;
        default:
            message = lastMessage;
            break;
    }
    return message;
}
