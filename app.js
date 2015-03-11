var express = require ('express');//Require express
var bodyParser = require('body-parser');//Parses all body as string
// var path = require ('path');
var mongoose = require('mongoose');//makes mongo easier to work with
var methodOverride = require('method-override');//override the method of a request 
var Prospect = require('./models/Prospect');
var app = express();//Creates a new express instance

var config = require('./config');
var CONNECTION_STRING = config.mongo;


//MIDDLEWARE AREA
app.use(express.static(__dirname, 'views'));//Tell express where to find static files
app.set('view engine', 'jade');//Tell server we're using .jade files instead of .html files
app.use(methodOverride('_method'));//use the methodOverride method
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect(CONNECTION_STRING);

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/form', function (req, res) {
  res.render('form');
});

app.post('/form', function (req, res) {
  // res.send('You sent the name "' + req.body.name + '".');
  // var firstname = req.body.firstname;
  // var lastname = req.body.lastname;
  // console.log(req.body);
  
  //create a new prospect & save then send res.json/res.send with it
  //mongoose save to database

//   var prospect = {
//     firstname: req.params.firstname,
//     lastname: req.params.lastname
//   };

//   // var data = new prospectSchema(prospect);

//   Prospect.save(function (error, Prospect) {
//     if(error) {
//       console.log(error);
//       res.json(Prospect);
//     } else {
//       res.json(Prospect);
//     }
//   });
// });
  var prospect = new Prospect({
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });
  prospect.save(function (err, prospect) {
    if (err) { return next(err); }
      res.json(201, prospect);
    });
  });

  // var locals = {
  //   firstname: req.body.firstname + ' ' + req.body.lastname
  // };
  // res.render('./views/form.jade', locals);

//   var prospect_data = {
//     firstname: req.params.first,
//     lastname: req.params.last
//   };
//   var prospect = new Prospect (prospect_data);

//   prospect.save(function(error, data) {
//     if(error) {
//       res.json(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

//   Prospect.find({}, function (error, data) {
//     console.log(data);
//     res.json(data);
//   });

  // var account_info = {
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname
  // };
  // Prospect.save(function(err, user) {
  //   if (err) {
  //     throw err;
  //   } else {
  //     res.json(data);
  //   }
  // });

  // req.body.info = req.prospect.firstname + ' ' + req.prospect.lastname;

  // var new_info = new Prospect(req.body);
  //   new_info.save(function (err, prospect) {
  //     if(err) {
  //       throw err;
  //     } else {
  //       res.json(data);
  //     }
  //   });

//   var new_user = new User({
//     firstname: req.body.firstname,
//     lastname: req.body.lastname
//   });

//   new_user.save(function (err, prospect) {
//     if(err) {
//       throw err;
//     } 
//     res.json(data);
//   });
// });

module.exports.app = app;
// module.exports = config;


app.listen(4000);