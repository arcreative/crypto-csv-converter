#!/usr/bin/env node

const fs = require('fs');
const json2csv = require('json2csv');

const coingecko = require('./lib/coingecko');

const FIELDS = ['date', 'high', 'low', 'open', 'close', 'volume'];

const pairs = [
  ['1', 'btc'],
  ['279', 'eth'],
  ['677', 'bat'],
  ['877', 'link'],
  ['975', 'cardano'],
  ['12171', 'polkadot'],
  ['13397', 'the-graph'],
  // ['44', 'ripple'],
  // ['486', 'zcash'],
];

pairs.forEach(function(pair) {
  coingecko(pair[0], function(data) {
    var output = json2csv({ data: Object.values(data), fields: FIELDS });
    fs.writeFileSync('./export-' + pair[1] + '.csv', output);
  });
});
