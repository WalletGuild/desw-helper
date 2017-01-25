var bitjws = require('bitjws-js')
var config = require('./deswhconfig.js')
var request = require('request');
privkey = bitjws.wifToPriv(config.wif);
baseURL = config.baseURL
serverKey = config.serverKey

_request = function _request (options, cb) {
  var self = this
  var headers = {'Content-Type': 'application/jose'};
  var message = bitjws.signSerialize(options.path, options.body, privkey.key, 1800);
  var data = {
    url: baseURL + options.path,
    body: message,
    headers: headers,
    method: options.method.toUpperCase()
  }
  request(data, function(err, raw, body) {
    if(err) {
      cb(err, null);
    } else if (raw.statusCode != 200) {
      cb(body, null);
    } else {
      var decoded = bitjws.validateDeserialize('/response', body, true);
      if(decoded.header.kid != serverKey) {
        return cb("bad server key " +  decoded.header.kid + " expected " + serverKey, null);
      }
      cb(null, decoded.payload);
    }
  });
}

sendCoins = function sendCoins (amount, currency, address) {
  console.log('Server: sending coins: %s', amount)
  var network = currency == 'BTC' ? 'bitcoin' : 'dash'
  _request({'path': '/debit', body:{'network': network, 'currency': currency, 'amount': amount, 'address': address,
                       'reference': ''}, 'method': 'post'}, function(err, debit){
    if(err) console.log(err)
    else console.log(debit)
  });
}

getBal = function getBal () {
  _request({'path': '/balance', 'body': {}, 'method': 'get'}, function(err, res){
    if(err) console.log(err)
    else {
      for (var i = 0; i < res.data.length; i++) {
        console.log(res.data[i].currency + ": " + res.data[i].available + " available out of total: " + res.data[i].total)
      }
    }
  });
}

getAddress = function getAddress (currency) {
  var network = currency == 'BTC' ? 'bitcoin' : 'dash'
  _request({'path': '/address', 'body': {'currency': currency, 'network': network}, 'method': 'post'}, function(err, res){
    if(err) console.log(err)
    else console.log(res.data.address)
  });
}

register = function register () {
  _request({'path': '/user', 'body': {'username': 'itestu'}, 'method': 'post'}, function(err, res){
    if(err) console.log(err)
    else console.log(res)
  });
}

printHelp = function printHelp () {
  console.log("DESW helper")
  console.log()
  console.log("Usage:")
  console.log("    nodejs deswh.js bal - get your account balance(s)")
  console.log("    nodejs deswh.js address <currency> - get a deposit address for the given currency (i.e. BTC or DASH)")
  console.log("    nodejs deswh.js register - Register your DESW account. Can only be done once.")
  console.log("    nodejs deswh.js send <amount> <currency> <address> - Withdraw the amount of currency to address (i.e. nodejs deswh send 0.01 BTC 1BTCaddress)")
}

process.argv.shift() // node or nodejs
process.argv.shift() // this file
if(process.argv[0] == 'bal') {
  getBal()
} else if(process.argv[0] == 'address') {
  if(process.argv.length == 1) printHelp()
  else getAddress(process.argv[1])
} else if(process.argv[0] == 'register') {
  register()
} else if(process.argv[0] == 'send') {
  if(process.argv.length != 4) printHelp()
  else sendCoins(process.argv[1], process.argv[2], process.argv[3])
} else if(process.argv[0] == 'help') {
  printHelp()
} else {
  printHelp()
}
