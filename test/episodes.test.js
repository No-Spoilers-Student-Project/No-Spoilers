const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const app = require('../lib/app');
require( '../lib/mongoose-setup' );

chai.use(chaiHttp);

const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3YTI4MjMyNGM2OTEyNDlhNzgxNmNkNCIsImlhdCI6MTQ3MDMyMTQxOH0.CyS3HE_hPBaPVAAfU2OGPKZQwgNyeRWDMB0FeL7fkKY';

describe('episode endpoints', () => {

  const request = chai.request(app);

  let testEpisode = { title: 'test-episode2', length: 42 };
  let testEpisode1 = { title: 'test-episode3', length: 43 };
  let testEpisode2 = { title: 'test-episode4', length: 44 };
  let testBadEpisode = { title: '', length: 45 };

  before( done => {
    Promise.all([
      request.post('/api/episodes').set('token',testToken).send(testEpisode),
      request.post('/api/episodes').set('token',testToken).send(testEpisode1)
    ])
    .then( result => {
      testEpisode = JSON.parse(result[0].text);
      testEpisode1 = JSON.parse(result[1].text);
      done();
    })
    .catch( err => {
      console.log('before episode err:',err.response.text);
      done(err);
    });
  });

  it('/GET on root route returns all', done => {
    request
      .get('/api/episodes')
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.isAbove(result.length, 1);
        done();
      });
  });

  it('/GET on episode id returns episode data', done => {
    request
      .get(`/api/episodes/${testEpisode1._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.deepEqual(result, testEpisode1);
        done();
      });
  });

  it('/POST method completes successfully', done => {
    request
      .post('/api/episodes')
      .set('token',testToken)
      .send(testEpisode2)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.title, testEpisode2.title);
        assert.equal(result.length, testEpisode2.length);
        testEpisode2 = result;
        done();
      });
  });

  it('/POST validates title property', done => {
    request
      .post('/api/episodes')
      .set('token',testToken)
      .send(testBadEpisode)
      .end((err, res) => {
        if (!err) return done(res);
        assert.equal(res.statusCode, 400);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.notEqual(result.length, testBadEpisode.length);
        done();
      });
  });

  it('/POST method gives error with bad json in request', done => {
    request
      .post('/api/episodes')
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
    testEpisode.title = 'test-put';
    const putUrl = `/api/episodes/${testEpisode._id}`;
    request
      .put(putUrl)
      .set('token',testToken)
      .send(testEpisode)
      .end((err, res) => {
        if (err) return done(err);
        let result = JSON.parse(res.text);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        assert.equal(result.title, testEpisode.title, JSON.stringify(result));
        done();
      });
  });

  it('/GET on recently updated episode returns correct changes', done => {
    request
      .get(`/api/episodes/${testEpisode._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.title, testEpisode.title, res.text);
        done();
      });
  });

  it('/DELETE method removes episode', done => {
    request
      .delete(`/api/episodes/${testEpisode._id}`)
      .set('token',testToken)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.deepEqual(result, testEpisode);
        done();
      });
  });

  it('/GET on recently deleted episode returns no data', done => {
    request
      .get(`/api/episodes/${testEpisode._id}`)
      .end((err, res) => {
        assert.equal(res.header['content-length'], 0);
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
        assert.include(res.text, 'GET /api/episodes');
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
      request.delete(`/api/episodes/${testEpisode1._id}`).set('token',testToken),
      request.delete(`/api/episodes/${testEpisode2._id}`).set('token',testToken)
    ])
    .then( () => done() )
    .catch(done);
  });

});
