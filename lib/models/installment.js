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
  tvdbid: String,
  goodreadsid: String,
  moviedbid: String,
  imageLink: String,
  season: String,
  episode: String,
  summary: [ String ]
}, { timestamps: true });

installment.statics.exists = function (id) {
  return this
    .findById(id)
    .count()
    .then(count => count === 1 );
};

installment.statics.filterBySeries = function(id) {
  return Promise.all([
    Series.exists(id),
    this
    .find({series: id})
    .lean()
    .sort( {releaseDate: 1} )
    .select( {summary: {$slice: -1 }} )
  ])
  .then( ([seriesExists, installments]) => {
    if (!seriesExists) throw {status: 400, message: 'Series Not Found.'};
    return installments;
  });
};

installment.statics.returnApproved = function(userId, installments) {
  return User.findById(userId)
  .then(user => {
    const approvals = installments.map(e => {
      if (user.approvals.indexOf(e._id) > -1) {
        e.approved = true;
        return e;
      } else {
        const notApproved = {
          _id: e._id,
          series: e.series,
          name: e.name,
          releaseDate: e.releaseDate,
          season: e.season,
          episode: e.episode,
          unapproved: true
        };
        return notApproved;
      }
    });
    return approvals;
  });
};

module.exports = mongoose.model('Installment', installment);
