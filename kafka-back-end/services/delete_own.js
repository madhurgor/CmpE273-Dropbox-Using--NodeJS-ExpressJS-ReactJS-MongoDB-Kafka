var url1 = "mongodb://localhost:27017/login";
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');
var rimraf = require('rimraf');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));
  rimraf(path.join(__dirname,'../../') + `${msg.ownfolder} ${msg.username}`, function () {
    var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
      flags: 'a'
    })
    logger.write('\r\n Shared Folder "'+msg.folder+'" by user "'+msg.username+'" deleted on '+new Date(dt.now()));

    MongoClient.connect(url1, function(err, db) {
      if (err) throw err;
      var myquery = { group: msg.ownfolder, creator: msg.username };
      db.collection("groups").deleteOne(myquery, function(err, obj) {
        if (err) {
          throw err;
          re.cpde=401
          res.status(401).json();
        }
        console.log("1 document deleted");
        res.code=201;
        callback(null,res);
        //res.status(201).json();
        db.close();
      });
    });
  });
}

exports.handle_request = handle_request;
