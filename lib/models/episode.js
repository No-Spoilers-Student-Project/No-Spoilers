const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Series = require('./series');

const episode = new Schema({
  title: {
    type: String,
    required: true
  },
  medium: {
    type: String,
  },
  length: {
    type: Number,
    min: 0
  },
  airdate: Date,
  series: {
    type: Schema.Types.ObjectId,
    ref: 'Series'
  }
}, { timestamps: true });

module.exports = mongoose.model('Episode', episode);
