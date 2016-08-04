const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const app = require('../lib/app');
require( '../lib/mongoose-setup' );

chai.use(chaiHttp);

const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3YTI4MjMyNGM2OTEyNDlhNzgxNmNkNCIsImlhdCI6MTQ3MDMyMTQxOH0.CyS3HE_hPBaPVAAfU2OGPKZQwgNyeRWDMB0FeL7fkKY';

describe('series endpoints', () => {

  const request = chai.request(app);

  let testSeries = { name: 'test-series0', type: 'low' };
  let testSeries1 = { name: 'test-series1', type: 'med' };
  let testSeries2 = { name: 'test-series2', type: 'high' };
  let testBadSeries = { name: '', type: 'what' };

  before( done => {
    Promise.all([
      request.post('/api/series').set('token',testToken).send(testSeries),
      request.post('/api/series').set('token',testToken).send(testSeries1)
    ])
    .then( result => {
      testSeries = JSON.parse(result[0].text);
      testSeries1 = JSON.parse(result[1].text);
      done();
    })
    .catch(done);
  });

  it('/GET on root route returns all', done => {
    request
      .get('/api/series')
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.isAbove(result.length, 1);
        done();
      });
  });

  it('/GET on series id returns series data', done => {
    request
      .get(`/api/series/${testSeries._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.name, testSeries.name);
        done();
      });
  });

  it('/POST method completes successfully', done => {
    request
      .post('/api/series')
      .set('token',testToken)
      .send(testSeries2)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.name, testSeries2.name);
        assert.equal(result.type, testSeries2.type);
        testSeries2 = result;
        done();
      });
  });

  it('/POST validates title property', done => {
    request
      .post('/api/series')
      .set('token',testToken)
      .send(testBadSeries)
      .end((err, res) => {
        if (!err) return done(res);
        assert.equal(res.statusCode, 400);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.notEqual(result.type, testBadSeries.type);
        done();
      });
  });

  it('/POST method gives error with bad json in request', done => {
    request
      .post('/api/series')
      .set('token',testToken)
      .send('{"invalid"}')
      .end( (err,res) => {
        if(err) {
          let error = JSON.parse(err.response.text);
          assert.equal(error.status, 400);
          assert.include(error.message, 'problem parsing');
          return done();
        } else {
          return done(res);
        }
      });
  });

  it('/PUT method completes successfully', done => {
    testSeries.name = 'test-put';
    const putUrl = `/api/series/${testSeries._id}`;
    request
      .put(putUrl)
      .set('token',testToken)
      .send(testSeries)
      .end((err, res) => {
        if (err) return done(err);
        let result = JSON.parse(res.text);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        assert.equal(result.name, testSeries.name, JSON.stringify(result));
        done();
      });
  });

  it('/GET on recently updated series returns correct changes', done => {
    request
      .get(`/api/series/${testSeries._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.name, testSeries.name, res.text);
        done();
      });
  });

  it('/DELETE method removes series', done => {
    request
      .delete(`/api/series/${testSeries._id}`)
      .set('token',testToken)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.deepEqual(result, testSeries);
        done();
      });
  });

  it('/GET on recently deleted series returns no data', done => {
    request
      .get(`/api/series/${testSeries._id}`)
      .end((err, res) => {
        assert.equal(res.status, 400);
        done();
      });
  });

  it('returns endpoint list on api root route', done => {
    request
      .get('/api')
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        assert.include(res.text, 'GET /api/series');
        done();
      });
  });

  it('returns 404 for bad path', done => {
    request
      .get('/badpath')
      .end((err, res) => {
        assert.ok(err);
        assert.equal(res.statusCode, 404);
        done();
      });
  });

  // cleanup
  after( done => {
    Promise.all([
      request.delete(`/api/series/${testSeries1._id}`).set('token',testToken),
      request.delete(`/api/series/${testSeries2._id}`).set('token',testToken)
    ])
    .then( () => done() )
    .catch(done);
  });

});
