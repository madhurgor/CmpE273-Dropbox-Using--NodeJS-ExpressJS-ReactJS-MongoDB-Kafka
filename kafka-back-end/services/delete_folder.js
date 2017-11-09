var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');
var rimraf = require('rimraf');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));
  rimraf(path.join(__dirname,'../../') + `${msg.username}/normal/${msg.path}/${msg.folder}`, function () {
    var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
      flags: 'a'
    })
    logger.write('\r\n Folder "'+msg.folder+'" deleted from '+msg.path+' on '+new Date(dt.now()));
    res.code=201;
    callback(null,res);
  });
}

exports.handle_request = handle_request;
