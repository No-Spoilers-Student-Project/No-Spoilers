'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const character = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  series: {
    type: Schema.Types.ObjectId,
    ref: 'Series'
  }
}, { timestamps: true });

character.statics.exists = function (id) {
  return this
    .findById(id)
    .count()
    .then(count => count === 1 );
};

module.exports = mongoose.model('Character', character);
