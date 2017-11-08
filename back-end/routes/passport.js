var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var mongoURL = "mongodb://localhost:27017/login";
var kafka = require('./kafka/client');

/*module.exports = function(passport) {
  passport.use('login', new LocalStrategy(function(username, password, done) {
    MongoClient.connect(mongoURL, function(err, db) {
      if (err) {done(e,{});}
      var query = { username: username };
      db.collection("users").find(query).toArray(function(err, results) {
        if(err){
           done(e,{});
        } else {
           console.log(results);
           if(results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
             done(null, {username: username});
           } else {
             done(null, false);
           }
        }
        db.close();
      });
    });
  }));
};*/

module.exports = function(passport) {
  passport.use('login', new LocalStrategy(function(username, password, done) {
    console.log('in passport');
    kafka.make_request('login_topic',{"username":username,"password":password}, function(err,results){
      console.log('in result');
      console.log(results);
      if(err){
        done(err,{});
      } else {
        if(results.code == 200){
          console.log(results.username);
          //done(null,{username:"bhavan@b.com",password:"a"});
          done(null,{username:results.username});
        } else {
          done(null,false);
        }
      }
    });
    /*try {
      if(username == "bhavan@b.com" && password == "a"){
        done(null,{username:"bhavan@b.com",password:"a"});
      } else
        done(null,false);
    }
    catch (e){
      done(e,{});
    }*/
  }));
};
