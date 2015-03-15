var mongoose = require('mongoose');

var prospectSchema = mongoose.Schema({
  firstnamemale: String,
  lastnamemale: String,
  firstnamefemale: String,
  lastnamefemale: String,
  birthday: Date,
  age: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  tel: String
});

var Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;