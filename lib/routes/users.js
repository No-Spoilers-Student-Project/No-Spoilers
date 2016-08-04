const bodyparser = require('../bodyparser');
const User = require('../models/user');

const express = require('express');
const router = express.Router();

module.exports = router

.get('', (req,res,next) => {
  User.find()
  .lean()
  .then( data => res.send(data) )
  .catch( next );
})

.get('/:id', (req,res,next) => {
  User.findById(req.params.id)
  .lean()
  .then( user => res.send(user) )
  .catch( next );
})

.post('', bodyparser, (req,res,next) => {
  const newUser = new User(req.body);
  newUser.generateHash(req.body.password); // this replaces the plain text password with a hash
  newUser.save()
  .then( user => res.send(user) )
  .catch( next );
})

.put('/:id', bodyparser, (req,res,next) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .then( user => res.send(user) )
  .catch( next );
})

.delete('/:id', (req,res,next) => {
  User.findByIdAndRemove(req.params.id)
  .lean()
  .then( data => {
    if(!data) return Promise.reject(data);
    res.send(data);
  })
  .catch( next );
});
