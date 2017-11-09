var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  var foldername=msg.foldername,n1=0;
  var actualName=foldername;

  while(true)
  {
    if(!fs.existsSync(path.join(__dirname,'../../') + `/${msg.username}/normal/${msg.path}/` + foldername))
    {
      mkdirSync('../'+msg.username+'/normal/'+`/${msg.path}/`+foldername);

      var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${msg.username} ` +'log.txt', {
        flags: 'a'
      })
      logger.write('\r\n Created folder '+`/${msg.path}/`+foldername+' on '+new Date(dt.now()));

      break;
    }
    else
    {
      if(n1==0)
      {
        n1+=1;
        foldername=foldername+' ('+n1+')';
      }
      else
      {
        n1+=1;
        foldername=actualName+' ('+n1+')';
      }
    }
  }

  res.code=200;
  callback(null,res);
}

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

exports.handle_request = handle_request;
