var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  if (!msg.files) {
     return next(new Error('No files uploaded'))
  }

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\n Uploading file/s in folder '+msg.path+' on '+new Date(dt.now()));

  msg.files.forEach((file) => {
     var n1=0;
     while(true)
     {
       if(!fs.existsSync(path.join(__dirname,'../../') + `/${msg.username}/normal/${msg.path}/` + file.originalname))
       {
         fs.rename(path.join(__dirname,'../../') + '/uploads/' + file.filename, path.join(__dirname,'../../') + `/${msg.username}/normal/${msg.path}/` + file.originalname, function(err) {
               if ( err ) console.log('ERROR: ' + err);
           });

           logger.write('\r\n  Uploaded file \"'+file.originalname+'\" in folder '+msg.path+' on '+new Date(dt.now()));

         //fs.unlinkSync(path.join(__dirname, file.path))
         break;
       }
       else
       {
         if(n1==0)
         {
           n1+=1;
           var ext,name,oname=file.originalname,n;
           n=oname.lastIndexOf(".");
           ext=oname.substring(n);
           name=oname.substring(0,n);
           file.originalname=name+' ('+n1+')'+ext;
         }
         else
         {
           var ext,name,oname=file.originalname,n;
           n=oname.lastIndexOf(".");
           n3=oname.lastIndexOf("(")
           n2=oname.lastIndexOf(")")
           newadd=Number(oname.substring(n3+1,n2))+1;
           ext=oname.substring(n);
           n3=oname.lastIndexOf('(');
           name=oname.substring(0,n3+1);
           file.originalname=name+newadd+')'+ext;
         }
       }
     }
  })

  logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\n End Uploading file/s in folder '+msg.path+' on '+new Date(dt.now()));

  callback(null, res);
}

exports.handle_request = handle_request;
