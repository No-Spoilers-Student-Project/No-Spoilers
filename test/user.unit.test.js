const chai = require('chai');
const assert = chai.assert;
const User = require('../lib/models/user');

describe('user model', () => {

  let testUser = { username: 'Valid User', password: 'felgercarp' };
  let badUser = { username: '', password: 'frak' };
  let badUser2 = { username: 'Starbuck', password: '' };

  it('validates', done => {
    let newUser1 = new User(testUser);
    newUser1.validate( err => {
      assert.notOk(err);
      done();
    });
  });

  it('errors on missing username', done => {
    let newUser2 = new User(badUser);
    newUser2.validate( err => {
      assert.ok(err);
      assert.equal(err.errors.username.properties.message, 'Path `{PATH}` is required.');
      done();
    });
  });

  it('errors on missing password', done => {
    let newUser3 = new User(badUser2);
    newUser3.validate( err => {
      assert.ok(err);
      assert.equal(err.errors.password.properties.message, 'Path `{PATH}` is required.');
      done();
    });
  });
});
