# No Spoilers

Authors: Geoffrey Emerson, Arielle Foldoe, Aaron Bini  
Date: August 12th, 2016  

## About

No Spoilers is a web app that lets you look up information about your favorite book, movie, or tv series without worrying about seeing spoilers (information about future events you haven't seen yet). Just create an account, then "Approve" the episodes you've seen. Only information from approved episodes will be shown when you go exploring.

App details: No Spoilers uses Node.js, Express.js and Mongo DB. The back end API responds to GET, POST, PUT, and DELETE requests on `series` and `installments` resources. User authentication is required for POST, PUT, and DELETE calls. Query `/api` for a full list of endpoints.

## Prerequisites:
* [node.js](https://nodejs.org/en/)
* [Mongo DB](https://mongodb.com/)
* Testing: [Mocha](https://mochajs.org/)
* Testing: [Eslint](http://eslint.org/)

## Installation

1. Clone this repo to your local drive.
1. Run `npm install` to set up.
1. Run `npm start` or `node index.js` to start the server.
1. Tests can be run with `npm start` or `mocha`.


## Application Structure

/lib - The app's back end  
/lib/auth - authorization tools
/lib/models - Mongoose schemas  
/lib/routes - Express routes  
/node_modules - Third party tools
/public - The app's front end  
/public/hbs - View templates  
/public/lib - Third party tools  
/public/scripts - Controller files
/public/styles - CSS files  
/test - Mocha test scripts

## Coding Standards

- Indentation is two spaces
- Strings use single quotes
