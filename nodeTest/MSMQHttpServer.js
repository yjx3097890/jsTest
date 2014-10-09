var http = require('http');
var redis = require('redis');
var query = require('querystring');
var url = require('url');
var client;

var server = http.createServer();

server.on('request', function (req, res) {
	
	if (req.url.indexOf('favicon.ico') !== -1 ) {
		res.writeHeader(200, {'content-Type': 'image/x-icon'});
		res.end();
		return;
	}
	
	client = redis.createClient();
	
	client.on('error' , function (e) {
		console.log('redis error : ', e);
	});
	
	client.select(6);
	
	var name = url.parse(req.url, true).query.name;
	
	client.llen(name, function (err, len) {
		//console.log(name,len);
		
		if (len<=0) {
			res.end('end.');
		
		} else {
			var a = 0;
			for (var i=0; i<len;i++) {
				client.lpop(name, function (err, reply) {
					if (err) {
						console.log('lpop error:', err);
						return;
					}
					
					
					res.write(name + ':' +reply +'\n');  //这样顺序不一定，应用async
					a++;
					if (a===len) res.end();
					
				});
			}
			
		}
		
		client.quit();	
	});
	
	
});
server.listen(8124);
server.on('close', function (err) {
	client.end();
});
console.log('http server on 8124');