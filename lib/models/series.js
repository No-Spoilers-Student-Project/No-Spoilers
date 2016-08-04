const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const series = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Series', series);
