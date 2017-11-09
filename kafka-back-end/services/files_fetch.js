var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var files=[],folders=[];

  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\n Fetching file name/s on '+new Date(dt.now()));

  fs.readdirSync(path.join(__dirname,'../../') + `${msg.username}/normal/${msg.path}/`).forEach(file => {
    if(fs.lstatSync(path.join(__dirname,'../../') + `${msg.username}/normal/${msg.path}/${file}`).isDirectory())
      folders.push(file);
    else
      files.push(file);

   logger.write('\r\n  Fetched file name \"'+file+'\" on '+new Date(dt.now()));

  })

  logger.write('\r\n End fetching file name/s on '+new Date(dt.now()));

  res.files=files;
  res.folders=folders;
  callback(null,res);
  //res.status(201).json({files:files,folders:folders});
}

exports.handle_request = handle_request;
