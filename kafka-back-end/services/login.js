var mongoURL = "mongodb://localhost:27017/login";
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  MongoClient.connect(mongoURL, function(err, db) {
    if (err) {done(e,{});}
    var query = { username: msg.username };
    db.collection("users").find(query).toArray(function(err, results) {
      if(err){
        res.code = "500";
        res.value = "Failed Login";
        callback(null, res);
      } else {
         console.log(results);
         if(results.length > 0 && bcrypt.compareSync(msg.password, results[0].password)) {

           var crypt = 'dropbox_012465401';
           const token = jwt.sign({
             username: msg.username
           }, crypt)

           var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
             flags: 'a'
           })
           logger.write('\r\nlogged in on '+new Date(dt.now()));

           logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
             flags: 'a'
           })
           logger.write(`\r\n${msg.username} logged in on `+new Date(dt.now()));

           res.username= msg.username;
           res.code = "200";
           res.value = "Success Login";
           res.token=token;
           callback(null, res);
         } else {
           res.code = "401";
           res.value = "No Data";
           callback(null, res);
         }
      }
      db.close();
    });
  });
}

exports.handle_request = handle_request;
