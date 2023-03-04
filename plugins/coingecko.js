var moment = require('moment');
var request = require('request');
var coingeckoCoins = require('./coingecko-coins-list.json')

const symbolToId = {}
coingeckoCoins.forEach(function(coin) {
  symbolToId[coin.symbol] = coin.id;
})

module.exports = function(symbol, callback) {
  console.log(`Processing ${symbol}`);
  
  const startTimestamp = (moment().add(-1, 'year').valueOf() / 1000).toFixed(),
        endTimestamp = (moment().valueOf() / 1000).toFixed(),
        currencyId = symbolToId[symbol];
  
  // Check if we have a mapping
  if (!currencyId) {
    return callback(new Error(`No symbol found for ${symbol}`));
  }
  
  // Get the history
  request(`https://api.coingecko.com/api/v3/coins/${currencyId}/market_chart/range?vs_currency=usd&from=${startTimestamp}&to=${endTimestamp}`, function (err, res) {
    if (err) throw err;
    
    // Catch non-200 responses
    if (res.statusCode !== 200) {
      return callback(new Error(`Coingecko API threw ${res.statusCode} code for ${symbol} / ${currencyId}:\n\n${res.body}`));
    }

    // Map data to objects
    var data = {};
    JSON.parse(res.body).prices.forEach(function (item) {
      var date = moment(item[0]).format('l');
      data[date] = {
        date: date,
        high: item[1],
        low: item[1],
        open: item[1],
        close: item[1],
        volume: 1,
      };
    });

    callback(null, data);
  });
};
