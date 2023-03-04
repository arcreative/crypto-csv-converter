#!/usr/bin/env node

const fs = require('fs');
const json2csv = require('json2csv');

var argv = require('minimist')(process.argv.slice(2));
const pluginFileName = argv.p || argv.plugin || 'coingecko';
const coinsFileName = argv.c || argv.coins || 'coins.js';

let plugin;
try {
  plugin = require(`./plugins/${pluginFileName}`);
} catch (e) {
  console.log(`Invalid plugin: ${e.message}`);
  process.exit(1);
}

let coins;
try {
  coins = require(`./${coinsFileName}`);
} catch (e) {
  console.log(`Invalid coins.json file: ${e.message}`);
  process.exit(1);
}

// Process pairs
coins.forEach(function(symbol, idx) {
  
  setTimeout(function() {
    plugin(symbol, function(err, data) {

      // Just display the error, but continue
      if (err) {
        return console.log(err);
      }

      var data = Object.values(data);
      var output = json2csv({ data: data, fields: Object.keys(data[0]) });
      fs.writeFileSync('./exports/export-' + symbol + '.csv', output);
    });
  }, idx * 2000);
});
