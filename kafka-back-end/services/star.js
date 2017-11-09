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
  logger.write('\r\n Starred file \"'+msg.file+'\" of folder '+msg.path+' on '+new Date(dt.now()));

 fs.writeFileSync(path.join(__dirname,'../../')+`/${msg.username}/star/${msg.file}`, fs.readFileSync(path.join(__dirname,'../../')+`/${msg.username}/normal/${msg.path}/`+`/${msg.file}`));

  res.code=200;
  callback(null,res);
}

exports.handle_request = handle_request;
