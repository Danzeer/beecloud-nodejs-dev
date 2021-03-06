/**
 * Created by dengze on 8/9/15.
 */

var api = require('../sdk/beecloud.js');
var md5 = require('md5');
var app_id = "c5d1cba1-5e3f-4ba0-941d-9b0a371fe719",
    app_secret = "39a7a518-9ac8-4a9e-87bc-7885f33cf18c",
    timestamp = new Date().getTime(),
    app_sign = md5(app_id + timestamp + app_secret);
var data = {
    app_id : app_id,
    timestamp: timestamp,
    app_sign: app_sign,
    channel: "ALI_WEB",
    total_fee: 1,
    bill_no: "bctest" + timestamp,
    title: "白开水",
    return_url: "beecloud.cn",
    optional: { myMsg: "none"}
}
try {
    var promise = api.bill(data);
    promise.then(function(data) {
        process.stdout.write("data:" + data);
    }, function(err) {
        process.stdout.write(err);
    })
} catch (err) {
    process.stdout.write(err.message);
}


