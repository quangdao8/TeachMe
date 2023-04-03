import { create } from "apisauce";
import * as Consts from "./Consts";

class serviceHandle {
    constructor() {
        this.api = create({
            baseURL: Consts.HOST,
            timeout: 20000,
            header: {
                "content-type": `application/json`
            }
        });
        this.apiUpload = create({
            baseURL: Consts.HOST,
            timeout: 10000,
            headers: {
                "content-type": `multipart/form-data`
            }
        });
        this.apiMessagingAndroid = create({
            baseURL: "https://fcm.googleapis.com/fcm/send",
            timeout: 10000,
            headers: {
                "content-type": `application/json`,
                authorization: Consts.firebaseKey
            }
        });
        this.apiVoip = create({
            baseURL: Consts.HOST_NODE_SERVER,
            timeout: 10000,
            headers: {
                "content-type": `application/json`
            }
        });
    }

    returnData(response) {
        console.log("returnData ===>>>>>>>>>>>>>>", response);

        let errorMessage = "";
        if (Consts.STATUS_CODE.SUCCESS.includes(response.status) && response.ok) {
            return {
                response: response.data,
                error: false
            };
        }
        // response.data = JSON.parse(response.data);
        if (Consts.STATUS_CODE.NOTFOUND.includes(response.status)) {
            errorMessage = `${response.data.detail ? response.data.detail : response.data}`;
        } else if (response.data) {
            errorMessage = response.data;
        } else if (Consts.STATUS_CODE.AUTH.includes(response.status)) {
            errorMessage = `${response.data.detail ? response.data.detail : response.data}`;
        } else {
            errorMessage = response.problem;
        }
        return {
            errorMessage,
            error: true
        };
    }

    setToken = token => {
        this.api.setHeader("Authorization", `Token ${token}`);
        this.apiUpload.setHeader("Authorization", `Token ${token}`);
    };

    get = async (url, params) => {
        const response = await this.api.get(url, params);
        // logic handle response here
        return this.returnData(response);
    };

    post = async (url, payload) => {
        const response = await this.api.post(url, payload);
        // logic handle response here
        return this.returnData(response);
    };

    put = async (url, payload) => {
        const response = await this.api.put(url, payload);
        // logic handle response here
        return this.returnData(response);
    };

    patch = async (url, payload) => {
        const response = await this.api.patch(url, payload);

        // logic handle response here
        return this.returnData(response);
    };
    delete = async (url, params) => {
        const response = await this.api.delete(url, params);
        // logic handle response here
        return this.returnData(response);
    };

    uploadImage = async file => {
        const response = await this.apiUpload.post("upload/", file);
        // logic handle response here
        return response.data;
    };
    // xhrRequest = async (url) =>{
    //   const response = await this.api.get(url);
    //   // logic handle response here
    //   return this.returnData(response);
    // }

    sendDataMessagingAndroid = async (key, data) => {
        let messaging = {
            registration_ids: [key],
            priority: "high",
            content_available: true,
            data,
            collapse_key: "type_a"
        };
        const response = await this.apiMessagingAndroid.post("", messaging);
        return response;
    };
    //TODO: PUSH VOIP NOTIFICATION
    voipPushCall = async payload => {
        const response = await this.apiVoip.post("/voip_call/", JSON.stringify(payload));
        return response;
    };
}

export let ServiceHandle = new serviceHandle();
