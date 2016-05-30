var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
  port: 9000,
  debug: true,
  ssl: {
    key: fs.readFileSync('/etc/letsencrypt/live/istratii.me/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/istratii.me/fullchain.pem')
  }
});
