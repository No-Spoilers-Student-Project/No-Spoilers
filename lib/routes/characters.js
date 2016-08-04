const bodyparser = require('../bodyparser');
const Character = require('../models/character');

const express = require('express');
const router = express.Router();

module.exports = router

.get('', (req,res,next) => {
  Character.find()
  .lean()
  .then( data => res.send(data) )
  .catch( next );
})

.get('/:id', (req,res,next) => {
  Character.findById(req.params.id)
  .lean()
  .then( character => res.send(character) )
  .catch( next );
})

.post('', bodyparser, (req,res,next) => {
  new Character(req.body).save()
  .then( character => res.send(character) )
  .catch( next );
})

.put('/:id', bodyparser, (req,res,next) => {
  Character.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .then( character => res.send(character) )
  .catch( next );
})

.delete('/:id', (req,res,next) => {
  Character.findByIdAndRemove(req.params.id)
  .lean()
  .then( data => res.send(data) )
  .catch( next );
});