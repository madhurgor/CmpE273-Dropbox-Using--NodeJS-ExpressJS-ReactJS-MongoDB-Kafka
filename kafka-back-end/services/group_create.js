var url1 = "mongodb://localhost:27017/login";
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  var group=msg.group.filter((item)=>{return item!==''});
  var group=group.filter(function(elem, pos) {
      return group.indexOf(elem) == pos;
  })
  console.log(group);

  var i=0,m=[],nm=[],myObj=[];

  group.forEach(function(item){
    MongoClient.connect(url1, function(err, db) {
      if (err) throw err;
      var query = { username: item };
      db.collection("users").find(query).toArray(function(err, results) {
        if(err){
           throw err;
           res.code=401;
           res.message="Some Error";
           callback(null,res);
           //res.status(401).json({message: "Some Error"});
        } else {
           myObj.push({group:msg.grp_name,creator:msg.username,member:item});
           console.log(results);
           if(results.length > 0) {
              i++;
              m.push(item);
           } else {
              i++;
              nm.push(item);
           }
           if(i===group.length){
             if(err){
               throw err;
               res.code=401;
               res.message="Some Error";
               callback(null,res);
               //res.status(401).json({message: "Some Error"});
             }else if(fs.existsSync(path.join(__dirname,'../../') + `/${msg.grp_name} ${msg.username}`)) {
               res.code=202;
               res.message="Group already exists!!";
               callback(null,res);
               //res.status(202).json({message: "Group already exists!!"});
             }else{
               if(nm.length===0){mkdirSync('../'+msg.grp_name+' '+msg.username);
                 db.collection("groups").insertMany(myObj, function(err, response) {
                   if(err){
                     throw err;
                     res.code=401;
                     res.message="Some Error";
                     callback(null,res);
                     //res.status(401).json({message: "Some Error"});
                   }else{
                     res.code=201;
                     res.message="Data";
                     res.m=m
                     res.nm=nm;

                     var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
                       flags: 'a'
                     })
                     logger.write('\r\n Created group '+`/${msg.grp_name}/`+foldername+' on '+new Date(dt.now()));

                     callback(null,res);
                     //res.status(201).json({message: "Data",member:m,notMember:nm});
                   }
                 });
               }else{
                 res.code=201;
                 res.message="Data";
                 res.m=m
                 res.nm=nm;
                 callback(null,res);
                 //res.status(201).json({message: "Data",member:m,notMember:nm});
               }
             }
           }
        }
        db.close();
      });
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
