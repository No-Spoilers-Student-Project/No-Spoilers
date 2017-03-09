'use strict';

const errorhandler = require('./errorhandler');
const express = require('express');
const app = express();
const series = require('./routes/series');
const installments = require('./routes/installments');
const users = require('./routes/users');
const login = require('./routes/login');
const signup = require('./routes/signup');
const tvdb = require('./routes/tvdb');
const path = require( 'path' );
const publicPath = path.resolve( __dirname, '../public' );
const indexHtml = path.resolve( __dirname, '../index.html' );

module.exports = app
.use(express.static(publicPath))
.get('/', (req,res) => res.sendFile(indexHtml))
.get('/api', (req,res) => res.json(endpoints))
.use('/api/login', login)
.use('/api/signup', signup)
.use('/api/series', series)
.use('/api/installments', installments)
.use('/api/users', users)
.use('/api/tvdb', tvdb)
.use(errorhandler);

const endpoints = {

  // /api/series
  seriesList: 'GET /api/series',
  specificSeries: 'GET /api/series/:id',
  addSeries: 'POST /api/series',
  updateSeries: 'PUT /api/series/:id',
  removeSeries: 'DELETE /api/series/:id',

  // /api/installments
  installmentList: 'GET /api/installments',
  specificInstallment: 'GET /api/installments/:id',
  addInstallment: 'POST /api/installments',
  updateInstallment: 'PUT /api/installments/:id',
  removeInstallment: 'DELETE /api/installments/:id',

  // /api/login
  login: 'POST /api/login',

  // /api/signup
  signup: 'POST /api/signup',

  // /api/users
  userList: 'GET /api/users',
  specificUser: 'GET /api/users/:id',
  addUser: 'POST /api/users',
  updateUser: 'PUT /api/users/:id',
  updateUserApprovals: 'PUT /api/users/:id/approvals',
  removeUser: 'DELETE /api/users/:id'
};
