# Bitstamp API Client

bitstamp-api is a simple wrapper for communicating with BitStamp in Node.JS.

## Installation

    npm install bistamp-api

## Usage

    var Bitstamp = require('bitstamp-api');
    var api = new Bitstamp();

    api.transactions({time: 'minute'}, function(err, result) {
      if(!err) {
        console.log(result);
      } else {
        console.log(err);
      }
    });

## Dependencies

- underscore
- request
