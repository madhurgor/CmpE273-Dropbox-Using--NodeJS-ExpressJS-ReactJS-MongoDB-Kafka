var fs = require('fs');
var path = require('path');
var dateTime = require('node-datetime');
var nodemailer = require('nodemailer');

var dt = dateTime.create();

function handle_request(msg, callback){
  var res = {};
  console.log("In handle request of :"+ JSON.stringify(msg));
  var member=msg.member.filter((item)=>{return item!==''});
  var member=member.filter(function(elem, pos) {
      return member.indexOf(elem) == pos;
  })
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      /*host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
          user: 'real.user',
          user: 'verysecret'
      }
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'ethereal.user@ethereal.email',
          user: 'verysecret'
      }*/
      service: 'gmail',
       auth: {
              user: 'youremail@address.com@gmail.com',
              pass: 'yourpassword'
       }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"👻" <foo@blurdybloop.com>', // sender address
        to: member, // list of receivers
        subject: 'no-reply@dropbox.com ✔', // Subject line
        text: "'"+msg.username+"' has shared file '"+msg.file+"' with you. Please see attachment to view the file.", // plain text body
        //html: '<b>Hello world?</b>', // html body
        attachments: [
            {
                filename: msg.file,
                path: path.join(__dirname,'../../') + `/${msg.folder} ${msg.username}/${msg.file}`,
                cid: 'nyan@example.com' // should be as unique as possible
            },
            /*// String attachment
            {
                filename: 'notes.txt',
                content: 'Some notes about this e-mail',
                contentType: 'text/plain' // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
                filename: 'image.png',
                content: new Buffer(
                    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                        '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                        'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
                    'base64'
                ),

                cid: 'note@example.com' // should be as unique as possible
            },

            // File Stream attachment
            {
                filename: 'nyan cat ✔.gif',
                path: __dirname + '/assets/nyan.gif',
                cid: 'nyan@example.com' // should be as unique as possible
            }*/
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
            res.code=401;
            callback(null,res);
            //res.status(401).json();
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        transporter.close();
        res.code=200;
        callback(null,res);
        //res.status(200).json();
    });
  });
}

exports.handle_request = handle_request;
