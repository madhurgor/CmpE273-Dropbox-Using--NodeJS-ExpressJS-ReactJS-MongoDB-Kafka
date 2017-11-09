var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  fs.unlinkSync(path.join(__dirname,'../../')+`/${msg.username}/normal/${msg.path}/`+`/${msg.file}`);

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\n Deleted file \"'+msg.file+'\" from folder '+msg.path+' on '+new Date(dt.now()));

  try{
    fs.unlinkSync(path.join(__dirname,'../../')+`/${msg.username}/star/`+`/${msg.file}`);
  }catch(err){
    console.log("Deleting a un-starred file");
    //console.log(err);
  }

  res.code=201;
  callback(null,res);
}

exports.handle_request = handle_request;
