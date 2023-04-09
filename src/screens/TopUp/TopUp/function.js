// import { sha256 } from "react-native-sha256";
import { convertToQuery } from 'helper/helper';
const moment = require('moment');
const VNP_TMNCODE = 'N8RYYDO5';
const VNP_HASHSECRET = 'VRLPGKKVXDZARNINHMYXFRRKCHMDJZBW';
const vnp_Url = 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const vnp_ReturnUrl = 'https://sandbox.vnpayment.vn/tryitnow/Home/VnPayReturn';

async function vnp_secureHash(vnpParams) {
    const secretKey = VNP_HASHSECRET;
    let signData = secretKey + convertToQuery(vnpParams);
    // sha256(signData).then(secureHash => {
    //     let vnp_Params = vnpParams;
    //     vnp_Params["vnp_SecureHashType"] = "SHA256";
    //     vnp_Params["vnp_SecureHash"] = secureHash;
    //     let vnpUrl = vnp_Url;
    //     vnpUrl += convertToQuery(vnp_Params);
    //     return vnpUrl;
    // });

    // const secureHash = await sha256(signData);
    // vnp_Params["vnp_SecureHashType"] = "SHA256";
    // vnp_Params["vnp_SecureHash"] = secureHash;
    // vnpUrl += convertToQuery(vnp_Params);
    // return vnpUrl;
}

function vnp_param(params) {
    const currCode = 'VND';
    const locale = 'vn';
    // const ipAddr = params.ip;
    const ipAddr = '::1';
    let tmnCode = VNP_TMNCODE;
    let returnUrl = vnp_ReturnUrl;

    let createDate = moment().format('YYYYMMDDHHMMss');
    let orderId = moment().format('YYYYMMDDHHMMss');
    let amount = params.amount;
    let orderInfo = 'Thanh toan ' + params.amount;
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_OrderType'] = 'topup';
    return vnp_Params;
}

function sortObject(o) {
    var sorted = {},
        key,
        a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

export { vnp_secureHash, vnp_param, VNP_TMNCODE, VNP_HASHSECRET, sortObject, vnp_Url, vnp_ReturnUrl };
