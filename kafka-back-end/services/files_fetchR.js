var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var files=[];

  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\n Fetching starred file name/s on '+new Date(dt.now()));

  fs.readdirSync(path.join(__dirname,'../../') + `${msg.username}/star/`).forEach(file => {
    files.push(file);

   logger.write('\r\n  Fetched starred file name \"'+file+'\" on '+new Date(dt.now()));

  })

  logger.write('\r\n End fetching starred file name/s on '+new Date(dt.now()));

  res.files=files;
  callback(null,res);
  //res.status(201).json({files:files,folders:folders});
}

exports.handle_request = handle_request;
