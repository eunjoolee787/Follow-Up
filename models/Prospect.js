var mongoose = require('mongoose');

var prospectSchema = mongoose.Schema({
  firstnamemale: String,
  lastnamemale: String,
  firstnamefemale: String,
  lastnamefemale: String
});

var Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;