var mongoose = require('mongoose');

var prospectSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  gender: String,
  firstnameSpouse: String,
  lastnameSpouse: String,
  genderSpouse: String,
  birthday: Date,
  age: String,
  tel: String,
  email: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  facebook: String,
  instagram: String,
  initialdate: Date,
  createddate: {
    type: Date,
    default: Date.now
  },
  contactperson: String,
  nameofevent: String,
  previouslysaved: String,
  previouslybaptized: String,
  modifieddate: Date,
  modifieddateType: Date,
  modifieddateDecision: Date,
  visit: String,
  letter: String,
  visitchurch: String,
  phonecall: String, 
  emailed: String,
  saved: String,
  baptized: String,
  joinedthechurch: String
});

var Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;