var express = require ('express');//Require express
var bodyParser = require('body-parser');//Parses all body as string
// var path = require ('path');
var mongoose = require('mongoose');//makes mongo easier to work with
var methodOverride = require('method-override');//override the method of a request 
var Prospect = require('./models/Prospect');
var ejs = require('ejs');
var cors = require('cors');
var app = express();//Creates a new express instance
var sendMail = require('./sendmail');//require email

var session = require('express-session');// to keep track of users as they journey sites
var flash = require ('connect-flash');//shows an error message
var passport = require('passport');//authentication middleware
var LocalStrategy = require('passport-local').Strategy;//constructor function to create a new auth. strategy
var User = require('./models/users.js');

var config = require('./config');
var CONNECTION_STRING = config.mongo;


//MIDDLEWARE AREA
app.use(express.static('public'));//Tell express where to find static files
// app.use(express.static(__dirname, 'views'));//Tell express where to find static files
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

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    // console.log(username, password);
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



//FUNCTIONS
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated() ){
    return next();
  }
  //not authenticated
  res.redirect('/login');
}


// GET REQUEST
app.use(function(req, res, next) {
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
      req.session.test = true;
      console.log(req.session);
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
  // res.render('login');
  res.sendfile('./public/login.html');
});

//POST AREA
// LOGIN ROUTES
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })); 


// //handles logging out the user
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/', ensureAuthenticated, function (req, res, next) {
  // res.render('index');
  // res.render('../index.html');
  res.sendfile('./public/app.html');
//  next();
});

app.get('/form', ensureAuthenticated, function (req, res) {
  res.render('form');
});

app.get('/prospects', ensureAuthenticated, function (req, res) {
  Prospect.find({}, function (err, prospects) {
    res.json(prospects);
  });
});

app.get('/prospects/:prospectId', ensureAuthenticated, function (req, res) {
  var prospectId = req.params.prospectId;

    Prospect.findOne ({'_id': prospectId}, function (err, prospect) {
      res.json(prospect);
      });
  });

app.get('/prospects/:prospectId/export', ensureAuthenticated, function (req, res) {
  var prospectId = req.params.prospectId;
  function csvExport(prospect) {
    return '"' + String(prospect || "").replace(/\"/g, '""') + '"';
  } 
  var prospectHeaders = [
    "firstname",
    "lastname",
    "gender",
    "age",
    "tel",
    "initialdate",
    "contactperson",
    "firstnameSpouse",
    "lastnameSpouse",
    "genderSpouse",
    "birthday",
    "email",
    "street",
    "city",
    "state",
    "zip",
    "facebook",
    "instagram",
    "nameofevent",
    "previouslysaved",
    "previouslybaptized",
    "modifieddate",
    "visit",
    "letter",
    "visitchurch",
    "phonecall",
    "emailed",
    "modifieddateType",
    "saved",
    "baptized",
    "joinedthechurch",
    "modifieddateDecision"
  ].map(csvExport).join(',');

  function docToCSV(prospect) {
    var birthday = prospect.birthday;
    var initialdate = prospect.initialdate;    
    var modifieddate = prospect.modifieddate;
    var modifieddateType = prospect.modifieddateType;
    var modifieddateDecision = prospect.modifieddateDecision;
    if(birthday != null) {
      birthday = birthday.toLocaleDateString();
    }
    if(initialdate != null) {
      initialdate = initialdate.toLocaleDateString();
    }
    if(modifieddate != null) {
      modifieddate = modifieddate.toLocaleDateString();
    }
    if(modifieddateType != null) {
      modifieddateType = modifieddateType.toLocaleDateString();
    }
    if(modifieddateDecision != null) {
      modifieddateDecision = modifieddateDecision.toLocaleDateString();
    }
    return [
    prospect.firstname,
    prospect.lastname,
    prospect.gender,
    prospect.age,
    prospect.tel,
    initialdate,
    prospect.contactperson,
    prospect.firstnameSpouse,
    prospect.lastnameSpouse,
    prospect.genderSpouse,
    birthday,
    prospect.email,
    prospect.street,
    prospect.city,
    prospect.state,
    prospect.zip,
    prospect.facebook,
    prospect.instagram,
    prospect.nameofevent,
    prospect.previouslysaved,
    prospect.previouslybaptized,
    modifieddate,
    prospect.visit,
    prospect.letter,
    prospect.visitchurch,
    prospect.phonecall,
    prospect.emailed,
    modifieddateType,
    prospect.saved,
    prospect.baptized,
    prospect.joinedthechurch,
    modifieddateDecision
    ].map(csvExport).join(',');
  }

  var sent = false;
  function send(response) {
    response.setHeader('Contact-information', 'attachment; filename=prospect.csv');
    response.contentType('csv');
    response.write(prospectHeaders + '\n');
    sent = true;
  }

  Prospect.findOne({'_id': prospectId})
  .sort('lastname')
  .stream()
  .on('data', function(prospect) {
    if(!sent) {
      send(res); 
    }
    res.write(docToCSV(prospect) + '\n');
  })
  .on('close', function () {
    res.end();
  })
  .on('error', function (err) {
    res.send(500, {err: err, msg: "Failed to get contacts from db"});
  });

  });

app.post('/sendMail', ensureAuthenticated, function (req, res) {
  function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }
  if(!validateEmail(req.body.recipient)) {
    return res.json({success: false});
  } 
  sendMail("Your Prospect has been sent", "Here is the CSV that you've requested", req.body.csvContents, req.body.recipient, function(error, response) {
    if(error) {
      console.log(error);
      res.json({success: false});
    } else {
      console.log("Message sent!!");
      res.json({success: true});
    }
  });
});


app.get('/prospects/:prospectId/edit', ensureAuthenticated, function (req, res) {
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

app.put('/prospects/:prospectId', ensureAuthenticated, function (req, res) {
  console.log(req.params.prospectId);
  Prospect.findByIdAndUpdate(req.params.prospectId, req.body, function (err, prospect) {
    if(err) {
      throw err;
    } else {
      res.json(prospect);
    }
  });
});

app.post('/form', ensureAuthenticated, function (req, res) {

  console.log(req.body);
  var prospect = new Prospect({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    age: req.body.age,
    tel: req.body.tel,
    initialdate: req.body.initialdate,
    contactperson: req.body.contactperson, 
    firstnameSpouse: req.body.firstnameSpouse,
    lastnameSpouse: req.body.lastnameSpouse,
    genderSpouse: req.body.genderSpouse,
    birthday: req.body.birthday,
    email: req.body.email,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    nameofevent: req.body.nameofevent,
    previouslysaved: req.body.previouslysaved,
    previouslybaptized: req.body.previouslybaptized,
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


//POST - SAVE AREA
//saveMail
// app.post('/saveMail', ensureAuthenticated, function (req, res) {
//   saveMail("Your Prospect has been saved", "Here is the Contact that you've requested", req.body.saveContents, function(error, response) {
//     if(error) {
//       console.log(error);
//       res.json({success: false});
//     } else {
//       console.log("Contact saved!");
//       res.json({success: true});
//     }
//   });
// });

// //DELETE AREA
app.delete('/prospects/:prospectId', ensureAuthenticated, function (req, res) {
  console.log(req.params.id);
  Prospect.findByIdAndRemove(req.params.prospectId, function (err, prospect) {
    if(err) {
      return console.log(err);
    }
    res.json(201, prospect);
  });
});

module.exports.app = app;



app.listen(process.env.PORT || 4000);