var mongoose = require('mongoose');

var prospectSchema = mongoose.Schema({
  firstname: String,
  lastname: String
});

var Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;