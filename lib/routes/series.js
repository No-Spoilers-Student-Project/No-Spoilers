'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
const checkAuth = require('../auth/checkAuth')();

const Series = require('../models/series');
const Installment = require('../models/installment');


module.exports = router

.get('', (req,res,next) => {
  Series.find()
  .lean()
  .select('name description genre')
  .then( data => {
    // At this point 'data' is an array of Series objects with no Installment info.
    return Promise.all(
      // Now start building a new array based
      data.map( series => {
        // Find the installments that are related to each series
        return Installment.find({'series': series._id})
          .then( installmentArr => {
            // Then attach the array of related installments to each series object.
            series.installments = installmentArr;
            series.installmentCount = installmentArr.length;
            return series;
          });
      })
    );
  })
  .then ( data => res.send(data) )
  .catch( next );
})

.get('/:id/medium', (req, res, next) => {
  console.log(req.query.medium);
  Installment.findBySeriesAndMedium(req.query.medium, req.params.id)
    .then(installments => res.send(installments ) )
    .catch( next );
})

.get('/:id', (req,res,next) => {
  Series.findById(req.params.id)
  .lean()
  .then( series => {
    return Installment.find({'series': series._id})
    .sort({releaseDate: 1, medium: 1})
    .then( installmentArr => {
      series.installments = installmentArr;
      series.installmentCount = installmentArr.length;
      return series;
    });
  })
  .then( series => res.send(series) )
  .catch( next );
})

.post('', bodyparser, checkAuth, (req,res,next) => {
  new Series(req.body)
  .save()
  .then( series => res.send(series) )
  .catch( next );
})

.put('/:id', bodyparser, checkAuth, (req,res,next) => {
  Series.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .then( series => res.send(series) )
  .catch( next );
})

.delete('/:id', checkAuth, (req,res,next) => {
  Series.findByIdAndRemove(req.params.id)
  .lean()
  .then( data => {
    if(!data) return Promise.reject(data);
    res.send(data);
  })
  .catch( next );
});
