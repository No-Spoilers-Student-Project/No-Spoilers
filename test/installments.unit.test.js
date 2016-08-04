const chai = require('chai');
const assert = chai.assert;
const Installment = require('../lib/models/installment');

describe('installment model', () => {

  let testInstallment = { name: 'Good Installment', medium: 'TV Show' };
  let badInstallment = { name: '', medium: 'TV Show' };

  it('validates', done => {
    let installment1 = new Installment(testInstallment);
    installment1.validate( err => {
      assert.notOk(err);
      done();
    });
  });

  it('errors on bad data', done => {
    let installment1 = new Installment(badInstallment);
    installment1.validate( err => {
      assert.ok(err);
      assert.equal(err.errors.name.properties.message, 'Path `{PATH}` is required.');
      done();
    });
  });
});
