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
  tel: String,
  facebook: String,
  instagram: String,
  email: String,
  contactdate: Date,
  contactperson: String,
  nameofevent: String,
  previouslysaved: String,
  previouslybaptized: String,
  joinchurch: String,
  status: String,
  lastcontactdate: Date,
  createddate: Date,
  modifieddate: Date
});

var Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;