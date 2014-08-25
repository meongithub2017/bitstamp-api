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

## FAQ

- Q: I often receive invalid nonce / invalid signature errors, how do I fix that?
- A: Generate a new API key on the Bitstamp website.
