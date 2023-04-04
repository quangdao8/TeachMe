import { ICON, FONT_SF, Images } from "assets";

const _ = require("lodash");
const first_names = ["Thanh", "Phi", "HAI", "TRung", "ANh", "Hen", "Tyt", "Duong", "Hang"];
const last_names = ["Di", "Cave", "Pho", "Tep", "ANh", "Tuan", "Tu", "Oanh", "Minh"];

export function generateUsers(number) {
    let users = [];
    const names = [];
    for (let i = 0; i < number; i++) {
        let user = Object.assign({}, of_user[0]);
        let first_name = first_names[i];
        let last_name = last_names[i];
        user.about_user.user.first_name = first_name;
        user.about_user.user.last_name = last_name;
        user.nickname = `${first_name} ${last_name}`;
        users.push(user);
        names.push(user.nickname);
    }
    return users;
}
export const of_user = [
    {
        gender: 1,
        day_of_birth: "1995-09-09",
        type: 0,
        amount: "0",
        avatar: null,
        point: null,
        notificationId: null,
        latitude: "0.000000",
        longitude: "0.000000",
        address: null,
        city: null,
        position: null,
        job: null,
        school: null,
        academic_status: null,
        favorite: null,
        academic_achivement: null,
        main_subject: null,
        profile_desciption: null,
        consultant_fee: "0",
        about_user: {
            user: {
                username: "0123456789",
                id: 20,
                last_name: "Lan Anh1",
                first_name: "Phí"
            },
            gender: 2,
            day_of_birth: "1994-03-08",
            type: 1,
            amount: "0",
            avatar: null,
            point: null,
            notificationId: null,
            latitude: "0.000000",
            longitude: "0.000000",
            address: null,
            city: null,
            position: null,
            job: null,
            school: null,
            academic_status: null,
            favorite: null,
            academic_achivement: null,
            main_subject: {
                id: 4,
                deleted_at: null,
                name: "Tiếng Anh lớp 5",
                created_time: "2019-06-13T15:02:43.706691"
            },
            profile_desciption: null,
            consultant_fee: "0"
        },
        nickname: "HAI TEP",
        avatar: null
    }
];
