/**
 * Created by dengze on 8/9/15.
 */

var api = require('./beecloud.js');
api.bill({
    app_id:"test"
}).then(function(data) {
    //console.log("%s",data);
    process.stdout.write(data);
}, function(err) {
    console.log(err);
});


