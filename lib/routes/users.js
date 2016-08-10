'use strict';

const bodyparser = require('../bodyparser');
const User = require('../models/user');
const checkAuth = require('../auth/checkAuth')();

const express = require('express');
const router = express.Router();

module.exports = router

.get('', checkAuth, (req,res,next) => {
  User.find()
  .lean()
  // .select('-password')
  .then( data => res.send(data) )
  .catch( next );
})

.get('/:id', checkAuth, (req,res,next) => {
  User.findById(req.params.id)
  .lean()
  // .select('-password')
  .then( user => res.send(user) )
  .catch( next );
})

.post('', bodyparser, checkAuth, (req,res,next) => {
  const newUser = new User(req.body);
  newUser.generateHash(req.body.password); // this replaces the plain text password with a hash
  newUser.save()
  .then( user => res.send(user) )
  .catch( next );
})

.put('/:id/approvals', bodyparser, checkAuth, (req,res,next) => {
  console.log(req.body);
  User.changeApprovals(req.body.add, req.body.remove, req.params.id)
  .then( user => {
    res.send(user);
  })
  .catch( next );
})

.put('/:id', bodyparser, checkAuth, (req,res,next) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  // .select('-password')
  .then( user => res.send(user) )
  .catch( next );
})

.delete('/:id', checkAuth, (req,res,next) => {
  User.findByIdAndRemove(req.params.id)
  .lean()
  // .select('-password')
  .then( data => {
    if(!data) return Promise.reject(data);
    res.send(data);
  })
  .catch( next );
});
