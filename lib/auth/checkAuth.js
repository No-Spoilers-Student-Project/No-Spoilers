'use strict';

const tokenChecker = require('./token');
const User = require('../models/user.js');

module.exports = function getCheckAuth() {

  return function checkAuth(req, res, next) {
    const token = req.headers.token;

    if(!token) {
      return next({
        code: 400,
        error: 'unauthorized, no token provided'
      });
    }

    tokenChecker.verify(token)
    .then( tokenData => {
      // for valid token, attach payload to req
      req.user = tokenData;
      return req.user; 
    })
    .catch( () => {
      return next({
        code: 403,
        error: 'unauthorized, invalid token'
      });
    })
    .then( user => {
      User
      .findById(user.id)
      .then( user => {
        //check is exists
        if (!user) throw 'unauthorized, not a valid user';
        else {
          //req.user = {
            // probably add authorized roles here.
            // but for now, it's enough that this user exists.
          //};
          next();
        };
      }).catch( err => {
        return next({
          code: 403,
          error: err || 'no error text returned'
        });
      });

    })
    .catch( err => {
      return next({
        code: 403,
        error: err
      });
    });

  };
};