/**
 * Created by dengze on 8/9/15.
 */

var https = require("https");
var Q = require("q");

var hosts = ["apibj.beecloud.cn",
            "apisz.beecloud.cn",
            "apiqd.beecloud.cn",
            "apihz.beecloud.cn"];

var BCErrMsg = {
    NEED_PARAM:"需要字段"
}

var postFactory = function(path, paramCheck) {
    return function(params) {
        if (typeof(paramCheck) == "function") {
            //will throw error
            paramCheck(params);
        }

        var seed = Math.floor(Math.random()*hosts.length);
        var deferred = Q.defer();

        var postData = JSON.stringify(params);
        var options = {
            hostname: hosts[seed],
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };


        var req = https.request(options, function(res) {
            res.on('data', function(data) {
                deferred.resolve(data);
            });
        });
        req.on('error', function(e) {
            deferred.reject(e);
        });
        req.write(postData);
        req.end();

        return deferred.promise;
    };
};

var getFactory = function(path, paramCheck) {
    return function(params) {
        if (typeof(paramCheck) == "function") {
            //will throw error
            paramCheck(params);
        }

        var seed = Math.floor(Math.random()*hosts.length);
        var deferred = Q.defer();

        var getData = JSON.stringify(params);
        var options = {
            hostname: hosts[seed],
            port: 443,
            path: path + "?para=" + encodeURIComponent(getData),
            method: 'GET'
        };

        var req = https.request(options, function(res) {
            res.on('data', function(data) {
                deferred.resolve(data);
            });
        });
        req.on('error', function(e) {
            deferred.reject(e);
        });
        req.end();

        return deferred.promise;
    };
}

var commParamCheck = function(data) {
    if (!data["app_id"]) {
        throw new Error(BCErrMsg.NEED_PARAM + "app_id");
    }

    if (!data["timestamp"]) {
        throw new Error(BCErrMsg.NEED_PARAM + "timestamp");
    }

    if (!isset($data["app_sign"])) {
        throw new Error(BCErrMsg.NEED_PARAM + "app_sign");
    }
}
module.exports = {
    bill : postFactory('/1/rest/bill', function(data) {
        commParamCheck(data);
        switch (data["channel"]) {
            case "ALI":
            case "ALI_WEB":
            case "ALI_WAP":
            case "ALI_QRCODE":
            case "ALI_APP":
            case "ALI_OFFLINE_QRCODE":
            case "UN":
            case "UN_WEB":
            case "UN_APP":
            case "WX":
            case "WX_APP":
            case "WX_JSAPI":
            case "WX_NATIVE":
                break;
            default:
                throw new Error(BCErrMsg.NEED_PARAM + "channel");
                break;
        }
    }),
    refund : postFactory('/1/rest/refund', function(data) {
        commParamCheck(data);
        if (!data["refund_no"]) {
            throw new Error(BCErrMsg.NEED_PARAM + "refund_no");
        }
    }),
    transfers: postFactory('/1/rest/transfers', null),
    bills : getFactory('/1/rest/bills', commParamCheck),
    refunds: getFactory('/1/rest/refunds', commParamCheck),
    refundStatus: getFactory('/1/rest/refund/status', function(data) {
        commParamCheck(data);
        if (!data["refund_no"]) {
            throw new Error(BCErrMsg.NEED_PARAM + "refund_no");
        }
    })
};

