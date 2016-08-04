const chai = require('chai');
const assert = chai.assert;
const bodyparser = require('../lib/bodyparser');
const EventEmitter = require('events');

describe('bodyparser module', () => {

  it('parses bodies', done => {

    const bodyObj = { name: 'test-name', type: 'test-type' }; 
    const req = new EventEmitter();
    const res = {};

    bodyparser(req,res, () => {
      assert.deepEqual(req.body, bodyObj);
      done();
    });

    req.emit('data', JSON.stringify(bodyObj));
    req.emit('end');

  });

});
