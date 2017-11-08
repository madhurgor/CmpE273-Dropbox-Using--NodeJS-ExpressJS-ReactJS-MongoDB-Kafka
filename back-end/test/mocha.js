var assert = require('chai').assert;
var http = require('http');
var request = require('request');

describe('login test', function(){
  it('positive test case',
    function(done){
      var req = {username:"m@g.c2",password:"mmmmmm"}
      request.post('http://localhost:3001/users/login',function(req,res) {
      assert.equal(201,res.status);
      done();
    })
  });
});

describe('login test', function(){
  it('negative test case',
    function(done){
      var req = {username:"m@g.c2",password:"mmmmmm"}
      request.post('http://localhost:3001/users/login',function(req,res) {
      assert.equal(401,res.status);
      done();
    })
  });
});


describe('sign out test', function(){
  it('positive test case',
    function(done){
      var req = {username:"m@g.c3"}
      request.get('http://localhost:3001/users/signout',function(req,res) {
      assert.equal(201,res.status);
      done();
    })
  });
});

describe('sign out test', function(){
  it('negative test case',
    function(done){
      var req = {username:"m@g.c2"}
      request.get('http://localhost:3001/users/signout',function(req,res) {
      assert.equal(401,res.status);
      done();
    })
  });
});
