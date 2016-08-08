'use strict';

const Installment = require('../models/installment');
const bodyparser = require('../bodyparser');
const checkAuth = require('../auth/checkAuth')();

const express = require('express');
const router = express.Router();

module.exports = router

.get('', (req,res,next) => {
  Installment.find()
  .lean()
  .select('name summary series releaseDate')
  .populate('series', 'name')
  .then( data => res.send(data) )
  .catch( next );
})

.get('/:seriesId/approvals/:userId', (req, res, next) => {
  //medium could be passed as query string if we want to enhance searches: ?medium='TV'
  Installment.findBySeriesAndMedium(req.params.seriesId)
    .then(installments => {
      return Installment.returnApproved(req.params.userId, installments);
    })
    .then(approvals => {
      res.send(approvals);
    })
    .catch(next);
})

//localhost:3000/api/installments/57a3dbd7bdd9f4023d671e83/approvals/57a3da0bbdd9f4023d671e82

.get('/:id', (req,res,next) => {
  Installment.findById(req.params.id)
  .lean()
  .populate('series')
  .then( installment => res.send(installment) )
  .catch( next );
})

.post('', bodyparser, checkAuth, (req,res,next) => {
  new Installment(req.body)
  .save()
  .then( installment => res.send(installment) )
  .catch( next );
})

.put('/:id', bodyparser, checkAuth, (req,res,next) => {
  Installment.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .populate('series')
  .then( installment => res.send(installment) )
  .catch( next );
})

//this could be used to push summaries to beginning of array rather than end
//{$push: { summary: { $each: [ req.body.summary ], $position: 0 }}}

.put('/:id/summary', bodyparser, checkAuth, (req,res,next) => {
  Installment.findByIdAndUpdate(req.params.id, {$push: {summary: req.body.summary}}, {new:true})
  .then( installment => {
    res.send(installment);
  })
  .catch( next );
})

// .put('/:id/summary', bodyparser, checkAuth, (req,res,next) => {
//   Installment.findById(req.params.id, req.body, {new:true})
//   .then( installment => {
//     installment.summary.unshift(req.body.summary);
//     return installment.save();
//   })
//   .then(saved => {
//     res.send(saved);
//   })
//   .catch( next );
// })

.delete('/:id', checkAuth, (req,res,next) => {
  Installment.findByIdAndRemove(req.params.id)
  .lean()
  .populate('series')
  .then( data => {
    if(!data) return Promise.reject(data);
    res.send(data);
  })
  .catch( next );
});
