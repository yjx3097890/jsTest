var net = require('net');
var redis = require('redis');
var client;

var server = net.createServer(function (conn) {
	
	client = redis.createClient();
	
	client.on('error' , function (e) {
		console.log('redis error : ', e);
	});
	
	client.select(6);
	
	conn.on('data', function (data) {
		console.log(data + ' form '+ conn.remoteAddress + ':'+ conn.remotePort);
		var msg = JSON.parse(data);
		client.rpush(msg.name, msg.content);
	});
	
}).listen(3000);
server.on('close', function (err) {
	client.quit();
});
console.log('TCP server on 3000');