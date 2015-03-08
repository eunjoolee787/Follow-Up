var express = require ('express');
var bodyParser = require('body-parser');
var path = require ('path');
var app = express();
var config = require('../config');

app.use(express.static(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/form', function (req, res) {
  res.render('form');
});

app.post('/form', function (req, res) {
  // res.send('You sent the name "' + req.body.name + '".');
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  console.log(req.body);
});

module.exports.app = app;
module.exports = config;

app.listen(3000);