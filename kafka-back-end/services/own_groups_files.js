var url1 = "mongodb://localhost:27017/login";
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  var o=[];

  console.log(msg.username);

  MongoClient.connect(url1, function(err, db) {
    if (err) throw err;
    var query = { creator: msg.username };
    db.collection("groups").find(query).toArray(function(err, results) {
      if(err){
         throw err;
         res.code=401;
         res.message="Some Error";
         callback(null,res);
         //res.status(401).json({message: "Some Error"});
      } else {
         console.log(results);
         if(results.length > 0) {
            var c=0;
            results.forEach((item)=>{
              c++;
              o.push(item.group);

              o=o.filter(function(elem, pos) {
                return o.indexOf(elem) == pos;
              })

              if(c==results.length){
                res.code=201;
                res.message="Data";
                res.o=o;
                callback(null,res);
                //res.status(201).json({message: "Data",ownfolders:o,});
              }
            });
         } else {
            console.log("No data");
            res.code=401;
            res.message="No Data";
            callback(null,res);
            //res.status(401).json({message: "No data"});
         }
      }
      db.close();
    });
  });
}

exports.handle_request = handle_request;
