var express = require('express');
var request = require('request');
var cors = require('cors');
var FeedParser = require('feedparser');

var app = express();
app.use(cors());
module.exports.app = app;
app.set('port', (process.env.PORT || 5000));

var testing = [];
/*FeedParser Test Code*/
app.get('/feedparser', function(req1,res1){
var url = req1.query.url;
var req = request(url);
var feedparser = new FeedParser();

var collection = [];

req.on('error', function (error) {
  console.error(error);
});

req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});
feedparser.on('error', function (error) {
  console.error(error);
});

feedparser.on('readable', function () {
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;
//Add articles to collection
  while (item = stream.read()) {
    collection.push(item);    //array of objects
  }
});

feedparser.on('end', function () {
  var stream = this;
  var meta = this.meta;
  var finalResponse = {};
  finalResponse.entries = collection;
  finalResponse.meta = meta;
  res1.send(finalResponse);
});
});
/*END FeedParser Test Code*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
