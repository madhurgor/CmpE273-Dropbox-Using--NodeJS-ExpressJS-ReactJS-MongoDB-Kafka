var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var path = require('path');
var dateTime = require('node-datetime');

var url1 = "mongodb://localhost:27017/login";
var saltRounds=10;

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));
  MongoClient.connect(url1, function(err, db) {
    if (err) throw err;
    var query = { username: msg.username };
    db.collection("users").find(query).toArray(function(err, results) {
      if(err){
        res.code = "401";
        res.value = "Some Error";
        callback(null, res);
      } else {
        if(results.length == 0) {
           bcrypt.hash(msg.password, saltRounds, function(err, hash) {

             var myobj = { firstname: msg.firstname, lastname:msg.lastname, username:msg.username, password:hash };
             db.collection("users").insertOne(myobj, function(err, response) {
               if(err){
                 throw err;
                 res.code=401;
                 res.value="Some Error";
                 callback(null, res);
               }
               else
               {
                 mkdirSync('../'+msg.username);
                 mkdirSync('../'+msg.username+'/normal');
                 mkdirSync('../'+msg.username+'/star');

                 fs.writeFile(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', 'Created Account on '+new Date(dt.now()), function (err) {
                         if (err) throw err;
                 });

                 var logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
                   flags: 'a'
                 })
                 logger.write(`\r\n${msg.username} signed up on `+new Date(dt.now()));

                 console.log('hii');

                 res.code=201;
                 res.value="Sign Up Done!!";
                 console.log(res.code);
                 callback(null, res);
               }
             });
           });
        } else {
           res.code=200;
           res.value="Already a User!!";
           callback(null, res);
        }
      }
      //db.close();
    });
  });
}

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

exports.handle_request = handle_request;
