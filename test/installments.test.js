'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const app = require('../lib/app');
require( '../lib/mongoose-setup' );

chai.use(chaiHttp);
const request = chai.request(app);

describe('installment endpoints', () => {

  let testUser = {username: 'test-user', password: 'test-pass'};
  let testInstallment = { name: 'test-installment2', length: 42 };
  let testInstallment1 = { name: 'test-installment3', length: 43 };
  let testInstallment2 = { name: 'test-installment4', length: 44 };
  let testBadInstallment = { name: '', length: 45 };

  before( done => {
    request.post('/api/signup').send(testUser)
    .then( result => {
      const resultObj = JSON.parse(result.res.text);
      testUser.token = resultObj.token;
      testUser.id = resultObj.payload.id;
      return Promise.all([
        request.post('/api/installments').set('token',testUser.token).send(testInstallment),
        request.post('/api/installments').set('token',testUser.token).send(testInstallment1)
      ]);
    })
    .then( result => {
      testInstallment = JSON.parse(result[0].text);
      testInstallment1 = JSON.parse(result[1].text);
      done();
    })
    .catch( err => {
      console.log(err);
      done(err);
    });
  });

  it('/GET on root route returns all', done => {
    request
      .get('/api/installments')
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.isAbove(result.length, 1);
        done();
      });
  });

  it('/GET on installment id returns installment data', done => {
    request
      .get(`/api/installments/${testInstallment1._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.deepEqual(result, testInstallment1);
        done();
      });
  });

  it('/POST method completes successfully', done => {
    request
      .post('/api/installments')
      .set('token',testUser.token)
      .send(testInstallment2)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.title, testInstallment2.title);
        assert.equal(result.length, testInstallment2.length);
        testInstallment2 = result;
        done();
      });
  });

  it('/POST validates title property', done => {
    request
      .post('/api/installments')
      .set('token',testUser.token)
      .send(testBadInstallment)
      .end((err, res) => {
        if (!err) return done(res);
        assert.equal(res.statusCode, 400);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.notEqual(result.length, testBadInstallment.length);
        done();
      });
  });

  it('/POST method gives error with bad json in request', done => {
    request
      .post('/api/installments')
      .set('token',testUser.token)
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
    testInstallment.name = 'test-put';
    const putUrl = `/api/installments/${testInstallment._id}`;
    request
      .put(putUrl)
      .set('token',testUser.token)
      .send(testInstallment)
      .end((err, res) => {
        if (err) return done(err);
        let result = JSON.parse(res.text);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        assert.equal(result.name, testInstallment.name, JSON.stringify(result));
        done();
      });
  });

  it('/GET on recently updated installment returns correct changes', done => {
    request
      .get(`/api/installments/${testInstallment._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.name, testInstallment.name, res.text);
        done();
      });
  });

  it('/DELETE method removes installment', done => {
    request
      .delete(`/api/installments/${testInstallment._id}`)
      .set('token',testUser.token)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.deepEqual(result, testInstallment);
        done();
      });
  });

  it('/GET on recently deleted installment returns no data', done => {
    request
      .get(`/api/installments/${testInstallment._id}`)
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
        assert.include(res.text, 'GET /api/installments');
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
    return Promise.all([
      request.delete(`/api/installments/${testInstallment1._id}`).set('token',testUser.token),
      request.delete(`/api/installments/${testInstallment2._id}`).set('token',testUser.token)
    ])
    .then( () => {
      return request.delete(`/api/users/${testUser.id}`).set('token',testUser.token);
    })
    .then( () => done() )
    .catch(done);
  });

});
