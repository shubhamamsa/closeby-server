let mongoose = require('mongoose');

let spaceSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
});

module.exports = mongoose.model('Space', spaceSchema);