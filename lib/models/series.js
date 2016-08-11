'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const series = new Schema({
  name: {
    type: String,
    required: true
  },
  firstAired: String,
  description: {
    type: String
  },
  genre: {
    type: String
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Series'
  },
  tvdbid: String,
  goodreadsid: String,
  moviedbid: String
}, { timestamps: true });

series.statics.exists = function (id) {
  return this
    .findById(id)
    .count()
    .then(count => count === 1 );
};

module.exports = mongoose.model('Series', series);
