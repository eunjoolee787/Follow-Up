var mongoose = require('mongoose');
var crypto = require('crypto');//stores the password & salt properly
// var config = require('../config');

//set up user model in the DB
var userSchema = mongoose.Schema({
  username: String,
  password: String
});

//var newUser = new User();
//newUser.validPassword('password');
userSchema.methods.validPassword = function (notHashedPassword) {
  return (User.passwordCrypt(notHashedPassword) === this.password);
};//this.password refers to the password stored in mongolab

//User.passwordCrypt('password');
userSchema.statics.passwordCrypt = function (notHashedPassword) {
    var salted_user_password = notHashedPassword + config.salt;
    var shasum = crypto.createHash('sha512');
    shasum.update(salted_user_password);

    return shasum.digest('hex');
};


//going into DB and creating a user collection
var User = mongoose.model('User', userSchema);

module.exports = User;

