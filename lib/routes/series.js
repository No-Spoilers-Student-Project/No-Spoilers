'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
const checkAuth = require('../auth/checkAuth')();
const uniq = require('../uniq');

const Series = require('../models/series');
const Installment = require('../models/installment');
const User = require('../models/user');

const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser();
const goodreadsKey = process.env.GR_KEY;

module.exports = router

.get('', (req,res,next) => {
  Series.find()
  .lean()
  .then( data => {
    // At this point 'data' is an array of Series objects with no Installment info.
    return Promise.all(
      // Now start building a new array based
      data.map( series => {
        // Find the installments that are related to each series
        return Installment.find({'series': series._id})
          .then( installmentArr => {
            // Then attach the array of related installments to each series object.
            series.installments = installmentArr;
            series.installmentCount = installmentArr.length;
            return series;
          });
      })
    );
  })
  .then ( data => res.send(data) )
  .catch( next );
})

.get('/:id', (req,res,next) => {
  Series.findById(req.params.id)
  .lean()
  .then( series => {
    return Installment.find({'series': series._id})
    .sort({releaseDate: 1, medium: 1})
    .then( installmentArr => {
      series.installments = installmentArr;
      series.installmentCount = installmentArr.length;
      return series;
    });
  })
  .then( series => res.send(series) )
  .catch( next );
})

.get('/search/goodreads/:id', (req,res,next) => {
  const path='https://www.goodreads.com/search/index.xml';
  const queryObj = {key: goodreadsKey, q: req.params.id};

  // cribbed from postman
  var request = require('request');

  var options = {
    method: 'GET',
    url: path,
    qs: queryObj,
    headers: { 'cache-control': 'no-cache' }
  };

  request(options, function (error, response, body) {
    if (error) next(error);
    
    xmlParser.parseString(body, function (err, result) {
      // these parsed results are so, so ugly!
      if(result.GoodreadsResponse.search[0]['total-results'][0] === '0') res.send([]);
      else {
        const titleArr = result.GoodreadsResponse.search[0].results[0].work.map( function(book) {
          let dateString = '';
          if(book.original_publication_year[0]._) {
            dateString += book.original_publication_year[0]._;
          }
          if(book.original_publication_month[0]._) {
            if(dateString !='') dateString += '-';
            dateString += book.original_publication_month[0]._;
          }
          if(book.original_publication_month[0]._ && book.original_publication_day[0]._) {
            dateString += '-' + book.original_publication_day[0]._;
          }
                  
          const obj = {
            id: book.id[0]._,
            title: book.best_book[0].title[0],
            author: book.best_book[0].author[0].name[0],
            image_url: book.best_book[0].image_url[0],
            image_url_small: book.best_book[0].small_image_url[0],
            pub_date: dateString
          };
          return obj;
        });
        res.send(titleArr);
      };
    });    
  });

})

.get('/:id/medium', (req, res, next) => {
  Installment.findBySeriesAndMedium(req.query.medium, req.params.id)
    .then(installments => res.send(installments ) )
    .catch( next );
})

.get('/user/:userId', (req, res, next) => {
  User.findById(req.params.userId)
  .lean()
  .populate('approvals')
    .then(user => {
      return Promise.all(
        user.approvals.map(approval => {
          return Series.findById(approval.series)
            .then(series => {
              return series;
            });
        })
      );
    })
    .then(series => {
      let unique = uniq(series);
      res.send(unique);
    })
    .catch(next);
})

.post('', bodyparser, checkAuth, (req,res,next) => {
  new Series(req.body)
  .save()
  .then( series => res.send(series) )
  .catch( next );
})

.put('/:id', bodyparser, checkAuth, (req,res,next) => {
  Series.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .lean()
  .then( series => res.send(series) )
  .catch( next );
})

.delete('/:id', checkAuth, (req,res,next) => {
  Series.findByIdAndRemove(req.params.id)
  .lean()
  .then( data => {
    if(!data) return Promise.reject(data);
    res.send(data);
  })
  .catch( next );
});
