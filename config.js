console.log("env:", process.env.SECRET);
if (process.env.SECRET){
  module.exports = {
    "port": process.env.PORT,
    "secret": process.env.SECRET,
    "mongo": process.env.MONGO,
    "salt": process.env.SALT,
    "email": {"user": process.env.EMAIL_USER, "pass": process.env.EMAIL_PASS},
  }
} else {
  module.exports = require("./config.json");
}
