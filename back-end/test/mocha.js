var assert = require('chai').assert;
var http = require('http');
var request = require('request');

describe('signup test', function(){
  it('positive test case',
    function(done){
      var req = {firstname: 'm', lastname:'m', username:'m@g.c00', password:'mmmmmm'}
      request.post('http://localhost:3001/users/signup',function(req,res) {
      assert.equal("200",res.statusCode);
      done();
    })
  });
});

describe('signup test', function(){
  it('positive test case',
    function(done){
      var req = {firstname: 'm', lastname:'m', username:'m@g.c0', password:'mmmmmm'}
      request.post('http://localhost:3001/users/signup',function(req,res) {
      assert.equal("200",res.statusCode);
      done();
    })
  });
});

describe('signup test', function(){
  it('positive test case',
    function(done){
      var req = {firstname: 'm', lastname:'m', username:'m@g.c000', password:'mmmmmm'}
      request.post('http://localhost:3001/users/signup',function(req,res) {
      assert.equal("200",res.statusCode);
      done();
    })
  });
});

describe('signup test', function(){
  it('negative test case',
    function(done){
      var req = {firstname: 'm', lastname:'m', username:'m@g.c01', password:'mmmmmm'}
      request.post('http://localhost:3001/users/signup',function(req,res) {
      assert.equal("200",res.statusCode);
      done();
    })
  });
});


describe('sign out test', function(){
  it('positive test case',
    function(done){
      var req = {username:"m@g.c0"}
      request.post('http://localhost:3001/users/logout',function(req,res) {
      assert.equal(200,res.statusCode);
      done();
    })
  });
});

describe('sign out test', function(){
  it('negative test case',
    function(done){
      var req = {username:"m@g.c0"}
      request.post('http://localhost:3001/users/logout',function(req,res) {
      assert.equal(200,res.statusCode);
      done();
    })
  });
});

describe('sign out test', function(){
  it('negative test case',
    function(done){
      var req = {username:"m@g.c000"}
      request.post('http://localhost:3001/users/logout',function(req,res) {
      assert.equal(200,res.statusCode);
      done();
    })
  });
});

describe('sign out test', function(){
  it('negative test case',
    function(done){
      var req = {username:"m@g.c00"}
      request.post('http://localhost:3001/users/logout',function(req,res) {
      assert.equal(200,res.statusCode);
      done();
    })
  });
});
