var moment = require('moment');
var request = require('request');

module.exports = function(currencyId, callback) {
  request('https://www.coingecko.com/price_charts/' + currencyId + '/usd/max.json', function (err, res) {
    if (err) throw err;

    // Map data to objects
    var data = {};
    JSON.parse(res.body).stats.forEach(function (item) {
      var date = moment(item[0]).format('l');
      data[date] = {
        date: date,
        high: item[1],
        low: item[1],
        open: item[1],
        close: item[1],
        volume: 1
      };
    });

    callback(data);
  });
};
