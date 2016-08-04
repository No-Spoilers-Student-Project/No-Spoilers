const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Character = require('./character');
const Installment = require('./installment');

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

module.exports = mongoose.model('Appearance', appearance);
