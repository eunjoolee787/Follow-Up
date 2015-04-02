var nodemailer = require('nodemailer');
var config = require("./config");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: config.email  
});


function sendMail(from, to, subject, text, callback){
  transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text
  }, callback);//after sending

}

module.exports = sendMail; 