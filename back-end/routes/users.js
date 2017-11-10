var express = require('express');
var router = express();
var mysql = require('./mysql');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var dateTime = require('node-datetime');
var cookieParser = require('cookie-parser');
var rimraf = require('rimraf');
var kafka = require('./kafka/client');

const nodemailer = require('nodemailer');

//var passport = require("passport");
//var LocalStrategy = require("passport-local").Strategy;
var passport = require("passport");
require('./passport')(passport);
//var cors = require('cors');
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo")(expressSessions);
//var mongoStore = require("connect-mongostore")(expressSessions);

/*var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}*/

var dt = dateTime.create();

var MongoClient = require('mongodb').MongoClient;
var url1 = "mongodb://localhost:27017/login";

const saltRounds = 10;

var bodyParser = require('body-parser');
router.use(bodyParser.json());
var urlencodedParser=bodyParser.urlencoded({extended: false});

var upload = multer({ dest: '../uploads/' })

//router.use(cors(corsOptions));
router.use(cookieParser());
router.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
router.use(passport.initialize());

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/loginWithMySQL',urlencodedParser,function(req,res){
  var crypt = 'dropbox_012465401';
  //res.status(201).json({message: 'all set'});

    /*const fetchDataSQL = "select * from users where username='"+req.body.username+"' and password='"+req.body.password+"'";
    mysql.fetchData(function(err,results){
       if(err){
          throw err;
       } else {
          if(results.length > 0) {
            const token = jwt.sign({
              username: req.body.username
            }, crypt)
             //console.log("Data: " + results[0].count);
             //res.status(201).res.json({count: results[0].count});
             res.status(201).json({message: "Data found", token:token});
          } else {
             //console.log("No data");
             res.status(401).json({message: "No data"});
          }
       }
    }, fetchDataSQL);*/
    const fetchDataSQL = "select * from users where username='"+req.body.username+"'";
    mysql.fetchData(function(err,results){
       if(err){
          throw err;
       } else {
          if(results.length > 0 && bcrypt.compareSync(req.body.password, results[0].password)) {
            const token = jwt.sign({
              username: req.body.username
            }, crypt)

            var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', {
              flags: 'a'
            })
            logger.write('\r\nlogged in on '+new Date(dt.now()));

            logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
              flags: 'a'
            })
            logger.write(`\r\n${req.body.username} logged in on `+new Date(dt.now()));

             //console.log("Data: " + results[0].count);
             //res.status(201).res.json({count: results[0].count});
             res.status(201).json({message: "Data found", token:token});
          } else {
             console.log("No data");
             res.status(401).json({message: "No data"});
          }
       }
    }, fetchDataSQL);
});

/*router.post('/login',urlencodedParser,function(req,res){

  var crypt = 'dropbox_012465401';

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var query = { username: req.body.username };
    db.collection("users").find(query).toArray(function(err, results) {
      if(err){
         throw err;
         res.status(401).json({message: "Some Error"});
      } else {
         console.log(results);
         if(results.length > 0 && bcrypt.compareSync(req.body.password, results[0].password)) {
           const token = jwt.sign({
             username: req.body.username
           }, crypt)

           var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', {
             flags: 'a'
           })
           logger.write('\r\nlogged in on '+new Date(dt.now()));

           logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
             flags: 'a'
           })
           logger.write(`\r\n${req.body.username} logged in on `+new Date(dt.now()));

            res.status(201).json({message: "Data found", token:token});
         } else {
            console.log("No data");
            res.status(401).json({message: "No data"});
         }
      }
      db.close();
    });
  });
});*/

router.post('/login',urlencodedParser,function(req,res){

  passport.authenticate('login', function(err, user) {
      if(err) {
          res.status(500).json({message: "Some Error"});
      }
      if(!user) {
          res.status(401).json({message: "No data"});
      }else{
        req.session.user = user.username;
        console.log(req.session.user);
        console.log("session initilized");

        /*var crypt = 'dropbox_012465401';
        const token = jwt.sign({
          username: req.body.username
        }, crypt)

        var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', {
          flags: 'a'
        })
        logger.write('\r\nlogged in on '+new Date(dt.now()));

        logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
          flags: 'a'
        })
        logger.write(`\r\n${req.body.username} logged in on `+new Date(dt.now()));*/

        res.status(201).json({message: "Data found", token:user.token});
      }
  })(req, res);
});

router.post('/signupWithMySQL',urlencodedParser,function (req, res) {
  const fetchDataSQL = "select * from users where username='"+req.body.username+"'";
  mysql.fetchData(function(err,results){
     if(err){
        throw err;
     } else {
        if(results.length == 0) {
           //console.log("Data: " + results[0].count);
           //res.status(201).res.json({count: results[0].count});
           //res.status(201).json({message: "Data found"});
           bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
             const insertDataSQL = "insert into users(firstname,lastname,username,password) values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.username+"','"+hash+"')";

             mysql.insertData((err, results) => {
               if(err){
                 throw err;
               }
               else
               {
                 console.log("No. of results after insertion:" + results.affectedRows);
                 mkdirSync('../'+req.body.username);
                 mkdirSync('../'+req.body.username+'/normal');
                 mkdirSync('../'+req.body.username+'/star');

                 fs.writeFile(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', 'Created Account on '+new Date(dt.now()), function (err) {
                         if (err) throw err;
                 });

                 var logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
                   flags: 'a'
                 })
                 logger.write(`\r\n${req.body.username} signed up on `+new Date(dt.now()));

                 res.status(201).json(results);
               }
             },insertDataSQL);
           });
        } else {
           res.status(200).json({message: "Already a user..!!"});
        }
     }
  }, fetchDataSQL);
   //res.status(201).json({message: "Signed up.."});
});

router.post('/signup',urlencodedParser,function (req, res) {
  kafka.make_request('signup_topic',{ firstname: req.body.firstname, lastname:req.body.lastname, username:req.body.username, password:req.body.password }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      console.log("code "+results.code);
      if(results.code == 201){
        res.status(201).json(results);
      }else{
        res.status(200).json({message: "Already a user..!!"});
      }
    }
  });

  /*MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myobj = { firstname: req.body.firstname, lastname:req.body.lastname, username:req.body.username, password:req.body.password  };
    db.collection("users").insertOne(myobj, function(err, response) {
      if (err) throw err;
      console.log("1 document inserted");
      res.status(201).json();
      db.close();
    });
  });*/
});

router.post('/files', upload.any(), function (req, res, next) {
  kafka.make_request('files_topic',{ username:req.query.username, files:req.files }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).end();
    }
  });
})

router.post('/filesF', upload.any(), function (req, res, next) {
  kafka.make_request('filesF_topic',{ username:req.query.username, files:req.files, path:req.query.path }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).end();
    }
  });
})

router.post('/about',urlencodedParser,function (req, res) {
  const fetchDataSQL = "select * from users where username='"+req.body.username+"'";
  mysql.fetchData(function(err,results){
     if(err){
        throw err;
     } else {
        if(results.length > 0) {
           //console.log("Data: " + results[0].count);
           //res.status(201).res.json({count: results[0].count});
           res.status(201).json({message: "Data found", firstname:results[0].firstname, lastname:results[0].lastname, hobbies:results[0].hobbies, education:results[0].education, work:results[0].work, phone_no:results[0].phone_no, le:results[0].le, interest:results[0].interest});

           var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', {
             flags: 'a'
           })
           logger.write('\r\n Checked his/her information on '+new Date(dt.now()));

        } else {
           console.log("No data");
           res.status(401).json({message: "No data"});
        }
     }
  }, fetchDataSQL);
});

router.post('/about_change',urlencodedParser,function(req, res) {
  //const insertDataSQL = "insert into users values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.username+"','"+req.body.password+"')";
  const  insertDataSQL = "update users set firstname='"+req.body.firstname+"', lastname='"+req.body.lastname+"', phone_no='"+req.body.phone_no+"', education='"+req.body.education+"', hobbies='"+req.body.hobbies+"', work='"+req.body.work+"', le='"+req.body.le+"', interest='"+req.body.interest+"' where username='"+req.body.username+"'";

  /*mysql.updateData((err, results) => {
    if(err){
       throw err;
    }
    else
    {
      res.status(201).json(results);
    }
  },updateDataSQL);*/

  mysql.insertData((err, results) => {
    if(err){
      throw err;
    }
    else
    {
      console.log("No. of results after insertion:" + results.affectedRows);
      mkdirSync('../'+req.body.username);

      var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
        flags: 'a'
      })
      logger.write('\r\n Changed his/her information on '+new Date(dt.now()));

      res.status(201).json(results);
    }
  },insertDataSQL);

});

router.post('/files_fetch',urlencodedParser,function (req, res) {
  kafka.make_request('files_fetch_topic',{ username:req.body.username, path:req.body.path }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({files:results.files,folders:results.folders});
    }
  });
});

router.get('/open_folder',function (req, res) {
  kafka.make_request('open_folder_topic',{ username:req.query.username, path:req.query.path }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({files:results.files,folders:results.folders});
    }
  });
});

router.get('/delete_folder',function (req, res) {
  kafka.make_request('delete_folder_topic',{ username:req.query.username, path:req.query.path, folder:req.query.folder }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({files:results.files,folders:results.folders});
    }
  });
});

router.post('/files_fetchR',urlencodedParser,function (req, res) {
  kafka.make_request('files_fetchR_topic',{ username:req.body.username, path:req.body.path }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({files:results.files});
    }
  });
});

router.get('/download',function(req, res){
  kafka.make_request('download_topic',{ username:req.query.username, path:req.query.path, file:req.query.file }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({data:results.data});
    }
  });
  //res.status(200).json();
});

router.get('/delete',function(req, res){
  kafka.make_request('delete_topic',{ username:req.query.username, path:req.query.path, file:req.query.file }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json();
    }
  });
});

router.get('/star',function(req, res){
  kafka.make_request('star_topic',{ username:req.query.username, path:req.query.path, file:req.query.file }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });
});

router.get('/unstar',function(req, res){
  kafka.make_request('unstar_topic',{ username:req.query.username, path:req.query.path, file:req.query.file }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });
});

/*router.get('/logout',function(req, res){

  console.log(req.session.user);
  req.session.destroy();
  console.log('Session Destroyed');

  console.log(req.query.username);

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\nSigned out on '+new Date(dt.now()));

  logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
    flags: 'a'
  })
  logger.write(`\r\n${req.query.username} signed out on `+new Date(dt.now()));

  res.status(200).json();
});*/

router.post('/logout',function(req, res){
  kafka.make_request('logout_topic',{ username:req.body.username }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });

  console.log(req.session.user);
  req.session.destroy();
  console.log('Session Destroyed');
});

router.get('/createfolder',function(req, res){
  kafka.make_request('createfolder_topic',{ username:req.query.username, foldername:req.query.foldername, path:req.query.path }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });
});

/*router.get('/open_folder',function (req, res) {
  var files=[],folders=[];

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\n Fetching file name/s from folder '+req.query.path+' on '+new Date(dt.now()));

  console.log(path.join(__dirname,'../../') + `${req.query.username}/normal/${req.query.path}/`);

  fs.readdirSync(path.join(__dirname,'../../') + `${req.query.username}/normal/${req.query.path}/`).forEach(file => {
    if(fs.lstatSync(path.join(__dirname,'../../') + `${req.query.username}/normal/${req.query.path}/${file}`).isDirectory())
      folders.push(file);
    else
      files.push(file);

      console.log(file);

   logger.write('\r\n  Fetched file name \"'+file+'\" on '+new Date(dt.now()));

  })

  logger.write('\r\n End fetching file name/s from folder '+req.query.path+' on '+new Date(dt.now()));

  res.status(201).json({files:files,folders:folders});
});*/

router.get('/group_create',function(req, res){
  kafka.make_request('group_create_topic',{ username:req.query.username, group:req.query.group, grp_name:req.query.grp_name,  }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else if(results.code===202) {
      res.status(202).json({message: "Group already exists!!"});
    } else {
      res.status(201).json({message: "Data",member:results.m,notMember:results.nm});
    }
  });
});

router.post('/own_groups_files',function(req,res){
  kafka.make_request('own_groups_files_topic',{ username:req.body.username, }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({message: "Data",ownfolders:results.o,});
    }
  });
});

router.post('/shared_groups_files',function(req,res){
  kafka.make_request('shared_groups_files_topic',{ username:req.body.username, }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({message: "Data",groupfolders:results.g});
    }
  });
});

router.get('/open_ownshared_folder',function (req, res) {
  kafka.make_request('open_ownshared_folder_topic',{ username:req.query.username, ownfolder:req.query.ownfolder }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({ownfiles:results.ownfiles});
    }
  });
});

router.get('/delete_own',function (req, res) {
  kafka.make_request('delete_own_topic',{ username:req.query.username, ownfolder:req.query.ownfolder }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({ownfiles:results.ownfiles});
    }
  });
});

router.post('/files_fetch_own',urlencodedParser,function (req, res) {
  kafka.make_request('files_fetch_own_topic',{ username:req.body.username, folder:req.body.folder }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({files:results.files});
    }
  });
});

router.post('/files_fetch_shared',urlencodedParser,function (req, res) {
  kafka.make_request('files_fetch_shared_topic',{ username:req.body.username, folder:req.body.folder, creator:req.body.creator }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(201).json({files:results.files});
    }
  });
});

router.post('/filesO', upload.any(), function (req, res, next) {
  kafka.make_request('filesO_topic',{ username:req.query.username, folder:req.query.folder, files:req.files, }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).end()
    }
  });
});

router.get('/downloadG',function(req, res){
  kafka.make_request('downloadG_topic',{ username:req.query.username, folder:req.query.folder, file:req.query.file, }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json({data:results.data});
    }
  });
});

router.get('/downloadR',function(req, res){
  kafka.make_request('downloadR_topic',{ username:req.query.username, file:req.query.file, }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json({data:results.data});
    }
  });
});

router.get('/deleteG',function(req, res){
  kafka.make_request('deleteG_topic',{ username:req.query.username, folder:req.query.folder, file:req.query.file, }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });
});

router.get('/share',function(req, res){
  kafka.make_request('share_topic',{ username:req.query.username, path:req.query.path, file:req.query.file, member:req.query.member }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });
});

router.get('/shareS',function(req, res){
  kafka.make_request('shareS_topic',{ username:req.query.username, file:req.query.file, member:req.query.member }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });
});

router.get('/shareO',function(req, res){
  console.log("req.query.folder part "+req.query.folder);
  kafka.make_request('shareO_topic',{ username:req.query.username, file:req.query.file, folder:'req.query.folder', member:req.query.member }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });
});

router.get('/shareG',function(req, res){
  kafka.make_request('shareG_topic',{ username:req.query.username, creator:req.query.creator, file:req.query.file, folder:req.query.folder, member:req.query.member }, function(err,results){
    console.log('in result');
    console.log(results);
    if(err){
      res.status(401).json({message: "Some Error"});
    } else {
      res.status(200).json();
    }
  });
});

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

module.exports = router;
