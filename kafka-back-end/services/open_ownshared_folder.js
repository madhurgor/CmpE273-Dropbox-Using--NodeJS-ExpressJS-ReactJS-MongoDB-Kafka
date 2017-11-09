var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  var ownfiles=[];

  fs.readdirSync(path.join(__dirname,'../../') + `${msg.ownfolder} ${msg.username}`).forEach(file => {
    ownfiles.push(file);
    console.log(file);
  })

  res.code=201;
  res.ownfiles=ownfiles;
  callback(null,res);
}

exports.handle_request = handle_request;
