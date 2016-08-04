const chai = require('chai');
const assert = chai.assert;
const Series = require('../lib/models/series');

describe('series model', () => {

  let testSeries = { name: 'Good Show', type: 'TV Show' };
  let badSeries = { name: '', type: 'TV Show' };

  it('validates', done => {
    let series1 = new Series(testSeries);
    series1.validate( err => {
      assert.notOk(err);
      done();
    });
  });

  it('errors on bad data', done => {
    let series1 = new Series(badSeries);
    series1.validate( err => {
      assert.ok(err);
      assert.equal(err.errors.name.message, 'Path `name` is required.');
      done();
    });
  });
});
