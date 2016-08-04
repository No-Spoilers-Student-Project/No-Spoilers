const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const app = require('../lib/app');
require( '../lib/mongoose-setup' );

chai.use(chaiHttp);

describe('user endpoints', () => {

  const request = chai.request(app);

  let testUser = { username: 'Apollo', password: 'Boxy' };
  let testUser1 = { username: 'Athena', password: 'Starbuck' };
  let testUser2 = { username: 'Starbuck', password: 'socialator' };
  let testBadUser = { username: '', password: 'frak' };

  before( done => {
    Promise.all([
      request.post('/api/users').send(testUser),
      request.post('/api/users').send(testUser1)
    ])
    .then( result => {
      testUser = JSON.parse(result[0].text);
      testUser1 = JSON.parse(result[1].text);
      done();
    })
    .catch( err => {
      console.log('before user err:',err);
      done(err);
    });
  });

  it('/GET on root route returns all', done => {
    request
      .get('/api/users')
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.isAbove(result.length, 1);
        done();
      });
  });

  it('/GET on user id returns user data', done => {
    request
      .get(`/api/users/${testUser1._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.deepEqual(result, testUser1);
        done();
      });
  });

  it('/POST method completes successfully', done => {
    request
      .post('/api/users')
      .send(testUser2)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.username, testUser2.username);
        assert.notEqual(result.password, testUser2.password); // store hashes, not plaintext passwords
        testUser2 = result;
        done();
      });
  });

  it('/POST validates title property', done => {
    request
      .post('/api/users')
      .send(testBadUser)
      .end((err, res) => {
        if (!err) return done(res);
        assert.equal(res.statusCode, 400);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.notEqual(result.password, testBadUser.password);
        done();
      });
  });

  it('/POST method gives error with bad json in request', done => {
    request
      .post('/api/users')
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
    testUser.username = 'Adama';
    const putUrl = `/api/users/${testUser._id}`;
    request
      .put(putUrl)
      .send(testUser)
      .end((err, res) => {
        if (err) return done(err);
        let result = JSON.parse(res.text);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        assert.equal(result.username, testUser.username, JSON.stringify(result));
        done();
      });
  });

  it('/GET on recently updated user returns correct changes', done => {
    request
      .get(`/api/users/${testUser._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.equal(result.username, testUser.username, res.text);
        done();
      });
  });

  it('/DELETE method removes user', done => {
    request
      .delete(`/api/users/${testUser._id}`)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.statusCode, 200);
        assert.include(res.header['content-type'], 'application/json');
        let result = JSON.parse(res.text);
        assert.deepEqual(result, testUser);
        done();
      });
  });

  it('/GET on recently deleted user returns no data', done => {
    request
      .get(`/api/users/${testUser._id}`)
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
        assert.include(res.text, 'GET /api/users');
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
      request.delete(`/api/users/${testUser1._id}`),
      request.delete(`/api/users/${testUser2._id}`)
    ])
    .then( () => done() )
    .catch(done);
  });

});
