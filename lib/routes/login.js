const bodyparser = require('../bodyparser');
const User = require('../models/user');
const token = require('../auth/token');

const express = require('express');
const router = express.Router();

module.exports = router

.post('', bodyparser, (req, res, next) => {
  const name = req.body.username;
  const pass = req.body.password;

  delete req.body.password; // remove plaintext password from req for security

  if (name == null || pass == null) {
    return next({ code: 400, error: 'username and password must be supplied' });
  }

  User.findOne({ username: name })
    .then( user => {
      if (!user || !user.compareHash(pass)) {
        throw { code: 400, error: 'invalid username or password' };
      }
      // create token
      return token.sign(user);
    })
    // send token as response. front end takes it from there.
    .then( token => {
      // possibly do cookie things here
      //res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
      res.send({ token });
    })
    .catch(next);
});
