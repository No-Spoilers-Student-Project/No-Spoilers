const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Series = require('./series');

const installment = new Schema({
  name: {
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
  releaseDate: Date,
  series: {
    type: Schema.Types.ObjectId,
    ref: 'Series'
  },
  summary: [ String ]
}, { timestamps: true });

module.exports = mongoose.model('Installment', installment);
