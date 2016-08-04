const chai = require('chai');
const assert = chai.assert;
const Episode = require('../lib/models/episode');

describe('episode model', () => {

  let testEpisode = { title: 'Good Episode', type: 'TV Show' };
  let badEpisode = { title: '', type: 'TV Show' };

  it('validates', done => {
    let episode1 = new Episode(testEpisode);
    episode1.validate( err => {
      assert.notOk(err);
      done();
    });
  });

  it('errors on bad data', done => {
    let episode1 = new Episode(badEpisode);
    episode1.validate( err => {
      assert.ok(err);
      assert.equal(err.errors.title.properties.message, 'Path `{PATH}` is required.');
      done();
    });
  });
});
