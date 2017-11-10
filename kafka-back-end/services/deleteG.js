var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request of :"+ JSON.stringify(msg));
      fs.unlinkSync(path.join(__dirname,'../../')+`/${msg.folder} ${msg.username}/`+`/${msg.file}`);
      res.code=200;
      callback(null,res);
      //res.status(200).json();
}

exports.handle_request = handle_request;
