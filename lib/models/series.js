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
  genre: {
    type: String
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Series'
  }
}, { timestamps: true });

module.exports = mongoose.model('Series', series);
