var _ = require('underscore');
var request	= require('request');
var crypto = require('crypto');

var Bitstamp = function(key, secret, client_id) {
  this.key = key;
  this.secret = secret;
  this.client_id = client_id;
  this.timeoutMS = 5000;
  this.orderPriceMaxDecimals = 2;

  this.url = 'https://www.bitstamp.net';

  _.bindAll(this, 'postReq', 'getReq', 'transactions', 'ticker', 'order_book', 'eur_usd', 'balance', 'user_transactions', 'open_orders', 'cancel_order', 'buy', 'sell', 'withdrawal_requests', 'bitcoin_withdrawal', 'bitcoin_deposit_address', 'unconfirmed_btc', 'ripple_withdrawal', 'ripple_address');
};

Bitstamp.prototype.postReq = function(action, callback, params) {
	// Set custom User-Agent string
  var headers = [];
	headers['User-Agent'] = 'Bitstamp Javascript API Client';

  var path = '/api/' + action + '/';

  if(!this.key || !this.secret || !this.client_id)
    return callback('Must provide key, secret and client ID to make this API request.');

  var nonce = '' + new Date().getTime();
  var message = nonce + this.client_id + this.key;
  var signer = crypto.createHmac('sha256', new Buffer(this.secret, 'utf8'));
  var signature = signer.update(message).digest('hex').toUpperCase();

  params = _.extend({
    key: this.key,
    signature: signature,
    nonce: nonce
  }, params);

	var options = {
		url: this.url + path,
		method: 'POST',
		headers: headers,
    timeout: this.timeoutMS,
		form: params
	};

	var req = request.post(options, function(error, response, body) {

		if(typeof callback === 'function') {
			var data;

			if(error) {
				callback(new Error('Error in server response: ' + JSON.stringify(error)), null);
				return;
			}

			try {
				data = JSON.parse(body);
			}
			catch(e) {
				callback(new Error('Could not understand response from server: ' + body), null);
				return;
			}

			if(data.error && data.error.length && (data.error === 'Invalid nonce' || data.error === 'Invalid signature' || data.errpr === 'API key not found')) {
				callback(new Error(data.error), null);
			} else {
				callback(null, data);
			}
		}

	});

	return req;
};

Bitstamp.prototype.getReq = function(action, callback, params) {
  // Set custom User-Agent string
  var headers = [];
  headers['User-Agent'] = 'Bitstamp Javascript API Client';

  var path = '/api/' + action + '/';

  var options = {
    url: this.url + path,
    method: 'GET',
    headers: headers,
    qs: params,
    timeout: this.timeoutMS
  };

  var req = request.get(options, function(error, response, body) {

    if(typeof callback === 'function') {
      var data;

      if(error) {
        callback(new Error('Error in server response: ' + JSON.stringify(error)), null);
        return;
      }

      try {
        data = JSON.parse(body);
      }
      catch(e) {
        callback(new Error('Could not understand response from server: ' + body), null);
        return;
      }

      callback(null, data);

    }

  });

  return req;
};

//
// Public Functions
//

Bitstamp.prototype.transactions = function(options, callback) {
  if(!callback) {
    callback = options;
    options = undefined;
  }
  this.getReq('transactions', callback, options);
};

Bitstamp.prototype.ticker = function(callback) {
  this.getReq('ticker', callback);
};

Bitstamp.prototype.order_book = function(group, callback) {
  if(!callback) {
    callback = group;
    group = undefined;
  }
  this.getReq('order_book', callback, {group: group});
};

Bitstamp.prototype.eur_usd = function(callback) {
  this.getReq('eur_usd', callback);
};

//
// Private Functions
//

Bitstamp.prototype.balance = function(callback) {
  this.postReq('balance', callback);
};

Bitstamp.prototype.user_transactions = function(timedelta, callback) {
  if(!callback) {
    callback = timedelta;
    timedelta = undefined;
  }
  this.postReq('user_transactions', callback, {timedelta: timedelta});
};

Bitstamp.prototype.open_orders = function(callback) {
  this.postReq('open_orders', callback);
};

Bitstamp.prototype.cancel_order = function(id, callback) {
  this.postReq('cancel_order', callback, {id: id});
};

Bitstamp.prototype.buy = function(amount, price, callback) {
  this.postReq('buy', callback, {amount: amount, price: price});
};

Bitstamp.prototype.sell = function(amount, price, callback) {
  this.postReq('sell', callback, {amount: amount, price: price});
};

Bitstamp.prototype.withdrawal_requests = function(callback) {
  this.postReq('withdrawal_requests', callback);
};

Bitstamp.prototype.bitcoin_withdrawal = function(amount, address, callback) {
  this.postReq('bitcoin_withdrawal', callback, {amount: amount, address: address});
};

Bitstamp.prototype.bitcoin_deposit_address = function(callback) {
  this.postReq('bitcoin_deposit_address', callback);
};

Bitstamp.prototype.unconfirmed_btc = function(callback) {
  this.postReq('unconfirmed_btc', callback);
};

Bitstamp.prototype.ripple_withdrawal = function(amount, address, currency, callback) {
  this.postReq('ripple_withdrawal', callback, {amount: amount, address: address, currency: currency});
};

Bitstamp.prototype.ripple_address = function(callback) {
  this.postReq('ripple_address', callback);
};

module.exports = Bitstamp;
