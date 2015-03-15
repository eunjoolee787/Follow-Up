var mongoose = require('mongoose');

var prospectSchema = mongoose.Schema({
  firstnamemale: String,
  lastnamemale: String
});

var Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;