const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Character = require('./character');
const Episode = require('./episode');

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
  episode: {
    type: Schema.Types.ObjectId,
    ref: 'Episode',
    required: true
  },
  chapter: String
}, { timestamps: true });

module.exports = mongoose.model('Appearance', appearance);
