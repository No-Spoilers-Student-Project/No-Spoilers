'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const user = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: String,
  approvals: [{
    type: Schema.Types.ObjectId,
    ref: 'Installment'
  }]
});

user.statics.addApprovals = function(array, id) {
  //add functionality on client-side to prevent repeat ids being pushed to approvals
  return Promise.all([
    this.count({_id: id}),
    this.findById(id)
  ])
  .then(([userCount, user]) => {
    if (userCount !== 1) throw new Error({status: 400, message: 'User Not Found.'});
    user.approvals.push(...array);
    return user.save();
  });
};

user.methods.generateHash = function(password) {
  return this.password = bcrypt.hashSync(password, 8);
};

user.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', user);
