var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request of :"+ JSON.stringify(msg));

  if (!msg.files) {
     return next(new Error('No files uploaded'))
  }

  msg.files.forEach((file) => {
     var n1=0;
     while(true)
     {
       if(!fs.existsSync(path.join(__dirname,'../../') + `/${msg.folder} ${msg.username}/` + file.originalname))
       {
         fs.rename(path.join(__dirname,'../../') + '/uploads/' + file.filename, path.join(__dirname,'../../') + `/${msg.folder} ${msg.username}/` + file.originalname, function(err) {
               if ( err ) console.log('ERROR: ' + err);
           });

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

  res.code=200;
  callback(null,res);
  //res.status(201).json({files:files});
}

exports.handle_request = handle_request;
