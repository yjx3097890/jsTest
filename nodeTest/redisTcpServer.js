var net = require("net"),
redis = require('redis');

var server = net.createServer(function (conn) {
	console.log("connected");
	
	var client = redis.createClient();
	
	client.on("error", function (err) {
		console.log('Error '+ err);
	});
	
	client.select(5);
	
	conn.on('data', function (data) {
		console.log(data + 'from ' + conn.remoteAddress + ':' + conn.remotePort);
		
		try {
			var obj = JSON.parse(data);
			//add or overwrite
			client.hset(obj.member, 'first_name', obj.first_name, redis.print);
			client.hset(obj.member, 'last_name', obj.last_name, redis.print);
			client.hset(obj.member, 'score', obj.score, redis.print);
			client.hset(obj.member, 'date', obj.date, redis.print);
			
			//add to Zowie
			client.zadd('Zowie!', parseInt(obj.score), obj.member);
			
		} catch (e) {
			console.log('Redis Error '+ e);
		}
		
		
	});
	
	conn.on("close", function () {
		console.log("client closed connection.");
		client.quit();
	});
}).listen(9876);

console.log("server listening port 9876.");