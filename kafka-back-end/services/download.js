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
  logger.write('\r\n Downloaded file \"'+msg.file+'\" from folder '+msg.path+' on '+new Date(dt.now()));

  //res.download(path.join(__dirname,'../../')+`/${msg.username}/normal/${msg.path}/`+`/${msg.file}`);
  fs.readFile(path.join(__dirname,'../../')+`/${msg.username}/normal/${msg.path}/`+`/${msg.file}`, 'utf8', function(err, data) {
     if (err) {res.code=401; callback(null,res);}
     res.data=data;
     res.code=201;
     callback(null,res);
  });
}

exports.handle_request = handle_request;
