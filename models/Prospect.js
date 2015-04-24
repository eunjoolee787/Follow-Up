var mongoose = require('mongoose');

var prospectSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  gender: String,
  age: String,
  tel: String,
  initialdate: Date,
  contactperson: String,
  firstnameSpouse: String,
  lastnameSpouse: String,
  genderSpouse: String,
  birthday: Date,
  email: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  facebook: String,
  instagram: String,
  createddate: {
    type: Date,
    default: Date.now
  },
  nameofevent: String,
  previouslysaved: String,
  previouslybaptized: String,
  modifieddate: Date,
  visit: String,
  letter: String,
  visitchurch: String,
  phonecall: String, 
  emailed: String,
  modifieddateType: Date,
  saved: String,
  baptized: String,
  joinedthechurch: String,
  modifieddateDecision: Date
});

var Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;