var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  var files=[];

  console.log(msg.folder);
  console.log(msg.username);

  fs.readdirSync(path.join(__dirname,'../../') + `${msg.folder} ${msg.creator}/`).forEach(file => {
   files.push(file);
   console.log(file);
  })

  res.code=201;
  res.files=files;
  callback(null,res);
  //res.status(201).json({files:files});
}

exports.handle_request = handle_request;
