'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Series = require('./series');
const User = require('./user');

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

installment.statics.exists = function (id) {
  return this
    .findById(id)
    .count()
    .then(count => count === 1 );
};

//localhost:3000/api/installments/57a3dbd7bdd9f4023d671e83/approvals/57a3da0bbdd9f4023d671e82

installment.statics.findBySeries = function (id) {
  return Promise.all([
    Series.exists(id),
    this.find({series: id}).lean().select('name series releaseDate').populate('series', 'name')
  ])
  .then(([seriesExists, installments]) => {
    if (!seriesExists) throw new Error({status: 400, message: 'Series Not Found.'});
    return installments;
  });
};

//commented out code could allow for search based on medium as well as series
installment.statics.findBySeriesAndMedium = function(/*medium,*/ id) {
  return Promise.all([
    Series.exists(id),
    this.find({series: id /*medium: medium*/}, '-updatedAt -createdAt -length').lean().sort({releaseDate: 1}).select({summary: {$slice: -1 }})
  ])
  .then( result => {
    console.log(result);
    const seriesExists = result[0];
    const installments = result[1];
    if (!seriesExists) throw new Error({status: 400, message: 'Series Not Found.'});
    return installments;
  });
};

installment.statics.returnApproved = function(userId, installments) {
  return User.findById(userId)
  .then(user => {
    const approvals = installments.map(e => {
      if (user.approvals.indexOf(e._id) > -1) {
        return e;
      } else {
        e.summary = ['You have not approved this installment for viewing.'];
        return e;
      }
    });
    // const approvals = installments.filter(e => {
    //   if (user.approvals.indexOf(e._id) > -1) return true;
    // });
    return approvals;
  });
};

module.exports = mongoose.model('Installment', installment);
