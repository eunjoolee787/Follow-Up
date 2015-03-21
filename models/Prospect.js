var mongoose = require('mongoose');

var prospectSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
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
  contactperson: String,
  nameofevent: String,
  previouslysaved: String,
  previouslybaptized: String,
  joinchurch: String,
  status: String,
  lastcontactdate: Date,
  createddate: Date,
  modifieddate: Date,
  visit: String,
  letter: String,
  visitchurch: String,
  phonecall: String, 
  email: String
});

var Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;