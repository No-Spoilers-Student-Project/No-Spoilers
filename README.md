# Cf401 Lab08 Expressjs Single Resource Api

Author: Geoffrey Emerson  
Date: August 4th, 2016  

## About

A small web app to store episodic series titles and some info about each. Uses Express.js and Mongo DB. Front end is a rudimentary demo of interactivity. API responds to GET, POST, PUT, and DELETE requests on `series` and `episodes` resources. User authentication is required for POST, PUT, and DELETE calls. Query `/api` for a list of endpoints.

## Prerequisites:
* [node.js](https://nodejs.org/en/)
* [Mongo DB](https://mongodb.com/)
* Dev: [Mocha](https://mochajs.org/)
* Dev: [Eslint](http://eslint.org/)

## Installation

1. Clone this repo to your local drive.
1. Run `npm install` to set up.
1. Run `npm start` or `node index.js` to start the server.
1. Tests can be run with `npm start` or `mocha`.
