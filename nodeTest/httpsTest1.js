var https = require('https');
var fs = require('fs');


//var privateKey = fs.readFileSync('tsl/site.org.key').toString();
var privateKey = fs.readFileSync('tsl/site.key').toString();

var crt = fs.readFileSync('tsl/final.crt').toString();

var ops = {
  key: privateKey,
  cert: crt
};

https.createServer(ops, function (req, res) {
  res.writeHead(200);
  res.end(crt);

}).listen(443);
