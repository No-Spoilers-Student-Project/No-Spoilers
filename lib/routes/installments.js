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
  .select('name series airdate')
  .populate('series', 'name')
  .then( data => res.send(data) )
  .catch( next );
})

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