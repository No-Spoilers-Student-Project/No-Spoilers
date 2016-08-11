'use strict';

const express = require('express');
const router = express.Router();
const Series = require('../models/series');

// const bodyparser = require('../bodyparser');
// const checkAuth = require('../auth/checkAuth')();

const TVDB = require('node-tvdb');
const tvdb = new TVDB(process.env.TVDB_KEY);

module.exports = router

.get('/:id', (req,res,next) => {

  return Promise.all([
    Series.alreadyAdded(req.params.id),
    tvdb.getSeriesById(req.params.id)
  ])
  .then(([alreadyAdded, tvdbSeries]) => {
    if (alreadyAdded) throw new Error('Series already added.');
    return tvdbSeries;
  })
  .then(series => {
    res.send(series);
  })
  .catch( err => {
    console.log('Error searching TVDB for series detail: req.params.id=' + req.params.id);
    console.log(err);
    next(err);
  });
})

.get('/search/:id', (req,res,next) => {
  tvdb.getSeriesByName(req.params.id)
  .then( result => {
    res.send(result);
  })
  .catch( err => {
    console.log('Error searching TVDB for series name: req.params.id=' + req.params.id);
    console.log('Error returned:', err);
    next(err);
  });
})

.get('/episodes/:id', (req,res,next) => {
  tvdb.getEpisodesById(req.params.id)
  .then( result => {
    res.send(result);
  })
  .catch( err => {
    console.log('Error searching TVDB for series name: req.params.id=' + req.params.id);
    console.log('Error returned:', err);
    next(err);
  });
})

;
