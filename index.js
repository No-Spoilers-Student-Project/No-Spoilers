'use strict';

const app = require('./lib/app');
require( './lib/mongoose-setup' ); // starts up the Mongo connection so that there's no delay the first time a request is made

const port = process.env.PORT || 3000;

app.listen(port);

console.log('Server running on', port);
