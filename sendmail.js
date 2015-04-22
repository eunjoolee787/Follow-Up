var nodemailer = require('nodemailer');
var config = require("./config");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: config.email
});


function sendMail(subject, text, data, recipient, callback){
  transporter.sendMail({
    from: config.sender,
    to: recipient,
    cc: config.cc,
    subject: subject,
    text: text,
    attachments: [{
      'filename': 'prospect.csv',
      'content': data
    }]
  }, callback);//after sending

}

module.exports = sendMail; 