const Episode = require('../models/episode');
const bodyparser = require('../bodyparser');
const checkAuth = require('../auth/checkAuth')();

const express = require('express');
const router = express.Router();

module.exports = router

.get('', (req,res,next) => {
  Episode.find()
  .lean()
  .select('title series airdate')
  .populate('series', 'name')
  .then( data => res.send(data) )
  .catch( next );
})

.get('/:id', (req,res,next) => {
  Episode.findById(req.params.id)
  .lean()
  .populate('series')
  .then( episode => res.send(episode) )
  .catch( next );
})

.post('', bodyparser, checkAuth, (req,res,next) => {
  new Episode(req.body)
  .save()
  .then( episode => res.send(episode) )
  .catch( next );
})

.put('/:id', bodyparser, checkAuth, (req,res,next) => {
  Episode.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .populate('series')
  .then( episode => res.send(episode) )
  .catch( next );
})

.delete('/:id', checkAuth, (req,res,next) => {
  Episode.findByIdAndRemove(req.params.id)
  .lean()
  .populate('series')
  .then( data => {
    if(!data) return Promise.reject(data);
    res.send(data);
  })
  .catch( next );
});