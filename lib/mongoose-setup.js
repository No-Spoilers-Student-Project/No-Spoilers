const mongoose = require('mongoose');

// set up the URI to point to the database
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/series';

mongoose.Promise = Promise;

mongoose.connect(dbURI, function(err) {
  if (err) {
    console.log('Failed connecting to Mongodb!');
  } else if(process.env.NODE_ENV != 'test') { // for testing, success should be silent
    console.log('Successfully connected to Mongodb!');
  }
});

module.exports = mongoose;