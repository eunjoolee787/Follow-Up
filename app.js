var express = require ('express');//Require express
var bodyParser = require('body-parser');//Parses all body as string
// var path = require ('path');
var mongoose = require('mongoose');//makes mongo easier to work with
var methodOverride = require('method-override');//override the method of a request 
var Prospect = require('./models/Prospect');
var ejs = require('ejs');
var cors = require('cors');
var app = express();//Creates a new express instance

var config = require('./config');
var CONNECTION_STRING = config.mongo;


//MIDDLEWARE AREA
app.use(express.static(__dirname, 'views'));//Tell express where to find static files
app.set('view engine', 'ejs');//Tell server we're using .jade files instead of .html files
app.use(methodOverride('_method'));//use the methodOverride method
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(CONNECTION_STRING);

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/form', function (req, res) {
  res.render('form');
});

app.post('/form', function (req, res) {

  console.log(req.body);
  var prospect = new Prospect({
    firstnamemale: req.body.firstnamemale,
    lastnamemale: req.body.lastnamemale,
    firstnamefemale: req.body.firstnamefemale,
    lastnamefemale: req.body.lastnamefemale,
    birthday: req.body.birthday,
    age: req.body.age, 
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    tel: req.body.tel,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    // email: req.body.email,
    contactdate: req.body.email,
    contactperson: req.body.contactperson,
    nameofevent: req.body.nameofevent,
    previouslysaved: req.body.previouslysaved,
    previouslybaptized: req.body.previouslybaptized,
    joinchurch: req.body.joinchurch,
    status: req.body.status,
    lastcontactdate: req.body.lastcontactdate,
    createddate: req.body.createddate,
    modifieddate: req.body.modifieddate
  });

  prospect.save(function (err, prospect, next) {
    if (err) { return next(err); }
      res.json(201, prospect);
    });
  });

module.exports.app = app;
// module.exports = config;


app.listen(4000);
