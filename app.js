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
var User = require('./models/users.js');

var config = require('./config');
var CONNECTION_STRING = config.mongo;


//MIDDLEWARE AREA
app.use(express.static(__dirname, 'views'));//Tell express where to find static files
// app.set('view engine', 'ejs');
app.set('view engine', 'jade');
app.use(session({ //in every session, verify user session
  secret: config.secret,
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

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ username: username}, function (err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, { message: 'Incorrect username.'});
      }
      if(!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.'});
      }
      return done (null, user);
    });
  }
));

//Passport Area
//passport will serialize user instances to and from session
passport.serializeUser(function(user, done) {
  done(null, user);
});
//passport will deserialize user instances to and from session
passport.deserializeUser(function(user, done) {
  User.findById(user._id, function(err, user) {
    done(null, user);
  }); 
});

//FUNCTIONS
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated() ){
    return next();
  }
  //not authenticated
  res.redirect('/login');
}


// GET REQUEST
app.get('*', function(req, res, next) {
  //store new variable so I don't have to pass in all the req.user data to jade views
  res.locals.loggedIn = (req.user) ? true : false;
  next();
});

app.post('/validateUser', function(req, res) {
  User.findOne ({
    username: req.body.username, 
    password: User.passwordCrypt(req.body.password)
  }, 
  function (err, user) {
    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false });    
    }
  });
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.post('/signup', function (req, res) {
  //if not correct, let them try again
  //check the password
  if(req.body.password !== req.body.confirm_password) {
    console.log(req);
    return res.render('signup', {messages: "password does not match, please try again"});
  }

  else { //else passwords match
    var new_user = new User({
      username: req.body.username,
      password: User.passwordCrypt(req.body.password)
    });
    new_user.save(function (err, user) {//save is part of mongoose function
      if(err) {//error save in mongolab
        throw err;
      } 
      req.login(user, function(err) {//error in login the user part of mongoose
        if(err) {
          throw err;
        }
      });
      res.redirect('/');
    });
  } 
});

app.get('/change_password', ensureAuthenticated, function(req, res) {
  res.render('change_password');
});

app.post('/change_password', ensureAuthenticated, function(req, res) {
  //check two things:
  // 1. The current password the user entered matches the hashed password stored in the mongolab
  // 2. The new password the user entered matches the confirm password
  if(User.passwordCrypt(req.body.current_password) === req.user.password && req.body.new_password === req.body.confirm_password) {
    //param 1 is what the user you are trying to find
    //param 2 is what you want to change about the user
    //Find the user whose username is req.user.username and change their password
    User.findOneAndUpdate({ username: req.user.username }, 
      { password: User.passwordCrypt(req.body.new_password) }, function (err, user) {
        if(err) {
          throw err;
        } 
        res.redirect("/");
      });
  } else {
    return res.render('change_password', {messages: "password does not match, please try again"});
  }

});

app.get('/login', function (req, res) {
  res.render('login');
});

//POST AREA
// LOGIN ROUTES
app.post('/login',
  passport.authenticate('local', { successRedirect: '/change_password',
                                   failureRedirect: '/login',
                                   failureFlash: true })); 


// //handles logging out the user
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/form', ensureAuthenticated, function (req, res) {
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
  console.log(req.params.prospectId);
  Prospect.findByIdAndUpdate(req.params.prospectId, req.body, function (err, prospect) {
    if(err) {
      throw err;
    } else {
      res.json(prospect);
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
    initialdate: req.body.initialdate,
    contactperson: req.body.contactperson,
    nameofevent: req.body.nameofevent,
    previouslysaved: req.body.previouslysaved,
    previouslybaptized: req.body.previouslybaptized,
    joinchurch: req.body.joinchurch,
    modifieddate: new Date(), 
    modifieddateType: new Date(),
    modifieddateDecision: new Date(),
    visit: req.body.visit,
    letter: req.body.letter,
    visitchurch: req.body.visitchurch,
    phonecall: req.body.phonecall,
    emailed: req.body.emailed,
    saved: req.body.saved,
    baptized: req.body.baptized,
    joinedthechurch: req.body.joinedthechurch
  });

  prospect.save(function (err, prospect, next) {
    if (err) { 
      return next(err); 
    }
    res.json(201, prospect);
  });
});

// app.get('/prospects/:prospectId/edit', function (req, res) {
//   Prospect.findById(req.params.id, function (err, prospect) {
//     if (err) {
//       throw err;
//     } var locals = {
//       firstname: prospect.firstname,
//       lastname: prospect.lastname
//     };
//     res.render('prospect_edit', locals);
//   });
// });

// //DELETE AREA
app.delete('/prospects/:prospectId', function (req, res) {
  console.log(req.params.id);
  Prospect.findByIdAndRemove(req.params.prospectId, function (err, prospect) {
    if(err) {
      return console.log(err);
    }
    res.json(201, prospect);
  });
});

module.exports.app = app;
// module.exports = config;


app.listen(4000);