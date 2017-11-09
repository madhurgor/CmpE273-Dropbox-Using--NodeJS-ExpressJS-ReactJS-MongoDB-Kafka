var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\nSigned out on '+new Date(dt.now()));

  logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
    flags: 'a'
  })
  logger.write(`\r\n${msg.username} signed out on `+new Date(dt.now()));

  res.code=200;
  callback(null,res);

}

exports.handle_request = handle_request;
