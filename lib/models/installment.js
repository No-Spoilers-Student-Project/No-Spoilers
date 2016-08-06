'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Series = require('./series');

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

installment.statics.findBySeriesAndMedium = function(medium, id) {
  //this static method can be used to populate page where user will select installments to approve for viewing
  //user will filter based on series and medium, which will be passed to this method
  return Promise.all([
    Series.count({_id: id}),
    this.find({series: id, medium: medium}),
  ])
  .then(([seriesCount, installments]) => {
    console.log(seriesCount);
    console.log(installments);
    if (seriesCount !== 1) throw new Error({status: 400, message: 'Series Not Found.'});
    console.log('got here');
    return installments;
  });
};

module.exports = mongoose.model('Installment', installment);
