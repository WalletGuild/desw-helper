# desw-helper
A nodejs command line helper for desw account management.

 + Register with a DeSW server
 + Print your account balance(s)
 + Get deposit addresses
 + Send a withdrawal over the Bitcoin, Dash, or internal networks.

# Installation

This is a nodejs package, and can be installed by running `npm install`.

To configure the script for usage, move `deswhconfig.example.js` to `deswhconfig.js`, and add your WIF key.

# Usage

```
DESW helper

Usage:
    nodejs deswh.js bal - get your account balance(s)
    nodejs deswh.js address <currency> - get a deposit address for the given currency (i.e. BTC or DASH)
    nodejs deswh.js register - Register your DESW account. Can only be done once.
    nodejs deswh.js send <amount> <currency> <address> - Withdraw the amount of currency to address (i.e. nodejs deswh send 0.01 BTC 1BTCaddress)
```

