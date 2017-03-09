'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
// const Character = require('./character');
// const Installment = require('./installment');

const appearance = new Schema({
  summary: {
    type: String,
    required: true
  },
  character: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  installment: {
    type: Schema.Types.ObjectId,
    ref: 'Installment',
    required: true
  },
  chapter: String
}, { timestamps: true });

appearance.statics.exists = function (id) {
  return this
    .findById(id)
    .count()
    .then(count => count === 1 );
};

module.exports = mongoose.model('Appearance', appearance);
