var mongoose = require('mongoose');

//set up user model in the DB
var userSchema = mongoose.Schema({
  username: String,
  password: String
});

//going into DB and creating a user collection
var User = mongoose.model('User', userSchema);

module.exports = User;

