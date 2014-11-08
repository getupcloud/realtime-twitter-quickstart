#!/usr/bin/env node

var addr   = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';
var port   = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8000;

var express = require('express');
var fs      = require('fs');
var twitter = require('twitter');
var ws      = require('ws');
var path    = require('path');
var http    = require('http');

// Fill with your Twitter credentials //
var TWITTER_API_KEY             = process.env.TWITTER_API_KEY;
var TWITTER_API_SECRET          = process.env.TWITTER_API_SECRET;
var TWITTER_ACCESS_TOKEN        = process.env.TWITTER_ACCESS_TOKEN;
var TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

if (!(TWITTER_API_KEY && TWITTER_API_SECRET && TWITTER_ACCESS_TOKEN && TWITTER_ACCESS_TOKEN_SECRET)) {
  console.error('Missing Twitter key and access token.\n');
  console.error(' TWITTER_API_KEY\n TWITTER_API_SECRET\n TWITTER_ACCESS_TOKEN\n TWITTER_ACCESS_TOKEN_SECRET')
  require('sleep').sleep(1);
  process.exit(1);
}

// Word used to watch on twitter //
var hashTag = process.env.HASHTAG || '#nodejs';

// Web Server //
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware({ src: __dirname + '/public', force: true }));
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);

app.get('/', function(req, res) {
  res.render('index', { hashTag: hashTag });
});

// WebSocket //
var wss = new ws.Server({server: server});

wss.on('connection', function(ws) {
  console.log('%s: New WS client', Date(Date.now()));

  ws.on('close', function(code, message) {
    console.log('%s: Client disconnected', Date(Date.now()));
  });
});

wss.broadcast = function(data) {
  for(var i in this.clients) {
    this.clients[i].send(JSON.stringify(data));
  }
};

// Twitter Stream //
if (process.env.DEBUG != 'true') { // try not to reach twitter connection limits while in dev

var t = new twitter({
    consumer_key:        TWITTER_API_KEY,
    consumer_secret:     TWITTER_API_SECRET,
    access_token_key:    TWITTER_ACCESS_TOKEN,
    access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

t.stream('statuses/filter', { track: hashTag }, function(stream) {
  stream.on('error', function(error) {
    console.error('%s: ERROR:', Date(Date.now()), error);
  });

  stream.on('data', function(tweet) {
    console.log('%s: new tweet [@%s]', Date(Date.now()), tweet.user.screen_name);
    wss.broadcast({
      name:              tweet.user.name,
      screen_name:       tweet.user.screen_name,
      profile_image_url: tweet.user.profile_image_url,
      created_at:        tweet.created_at,
      text:              tweet.text
    });
  });
});

}

// Signal handlers (optional) //
process.on('exit', function() {
  // give a chance to do something upon exit
  console.log('%s: bye...', Date(Date.now()));
});

[ 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM' ].forEach(function(sig, index, array) {
  process.on(sig, function() {
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating app...', Date(Date.now()), sig);
      console.log('%s: App terminated.', Date(Date.now()) );
      process.exit(1);
    }
  });
});

// Start the app //
server.listen(port, addr);
console.log("%s: App listening on %s:%s", Date(Date.now()), addr, port);

