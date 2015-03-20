var express = require ('express');//Require express
var bodyParser = require('body-parser');//Parses all body as string
// var path = require ('path');
var mongoose = require('mongoose');//makes mongo easier to work with
var methodOverride = require('method-override');//override the method of a request 
var Prospect = require('./models/Prospect');
var ejs = require('ejs');
var cors = require('cors');
var app = express();//Creates a new express instance

var session = require('express-session');// to keep track of users as they journey sites
var flash = require ('connect-flash');//shows an error message
var passport = require('passport');//authentication middleware
var LocalStrategy = require('passport-local').Strategy;//constructor function to create a new auth. strategy
var crypto = require('crypto');//stores the password & salt properly

var config = require('./config');
var CONNECTION_STRING = config.mongo;


//MIDDLEWARE AREA
app.use(express.static(__dirname, 'views'));//Tell express where to find static files
app.set('view engine', 'ejs');//Tell server we're using .jade files instead of .html files
app.use(session({ //in every session, verify user session
  secret: 'follow-up',
  resave: false,
  saveUninitialized: true
}));
app.use(methodOverride('_method'));//use the methodOverride method
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());//use the flash/alert method
app.use(passport.initialize());//sets up passport
app.use(passport.session());//passport remembers your users
app.use(cors());

mongoose.connect(CONNECTION_STRING);

//Passport Area
//passport will serialize user instances to and from session
passport.serializeUser(function(user, done) {
  done(null, user);
});
//passport will deserialize user instances to and from session
passport.deserializeUser(function(user, done) {
    done(null, user);
});


app.get('*', function(req, res, next) {
  //store new variable so I don't have to pass in all the req.user data to jade views
  res.locals.loggedIn = (req.user) ? true : false;
  next();
});


//handles logging out the user
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/form', function (req, res) {
  res.render('form');
});

app.get('/prospects', function (req, res) {
  Prospect.find({}, function (err, prospects) {
    res.json(prospects);
  });
});

app.get('/prospects/:prospectId', function (req, res) {
  var prospectId = req.params.prospectId;

    Prospect.findOne ({'_id': prospectId}, function (err, prospect) {
      res.json(prospect);
      })
  });

app.get('/prospects/:prospectId/edit', function (req, res) {
  Prospect.findById(req.params.id, function (err, prospect) {
    if (err) {
      throw err;
    } var locals = {
      firstname: prospect.firstname,
      lastname: prospect.lastname
    };
    res.render('prospect_edit', locals);
  });
});

app.put('/prospects/:prospectId', function (req, res) {
  var editProspect = {
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };
  Prospect.findByIdAndUpdate(req.params.id, editProspect, function (err, prospect) {
    if (err) {
      throw err;
    } else {
      res.redirect('/prospect');
    }
  });
});

app.post('/form', function (req, res) {

  console.log(req.body);
  var prospect = new Prospect({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthday: req.body.birthday,
    age: req.body.age,
    tel: req.body.tel, 
    email: req.body.email,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    contactdate: req.body.contactdate,
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

  app.post('/login', auth.login);

// app.delete('/prospects/:prospectId', isOwner, function (req, res) {
//   Assignment.findByIdAndRemove(req.params.id, function (err, assignment) {
//     if(err) {
//       return console.log(err);
//     }
//     res.redirect('/prospect');
//   });
// });

module.exports.app = app;
// module.exports = config;


app.listen(4000);
