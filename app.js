var express = require ('express');
var app = express();

var path = require ('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

app.listen(3000);