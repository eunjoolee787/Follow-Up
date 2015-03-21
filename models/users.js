// var mongoose = require('mongoose');

// //set up user model in the DB
// var userSchema = mongoose.Schema({
//   username: String,
//   password: String
// });

// userSchema.methods.validPassword = function (check_password) {
//   return (passwordCrypt(check_password) === this.password);
// };

// function passwordCrypt(password) {
//   var salt = process.env.SALT;
//     var user_password = password;
//     var salted_user_password = user_password + salt;
//     var shasum = crypto.createHash('sha512');
//     shasum.update(salted_user_password);
//     var input_result = shasum.digest('hex');

//     return input_result
// }


// //going into DB and creating a user collection
// var User = mongoose.model('users', userSchema);

// module.exports = User;

