var redis = require('redis');

module.exports = function () {
	return function getStats(req, res, next) {
		
		var client = redis.createClient();
		
		client.on('error', function (err) {
			console.log('redis error:' + err);
		});
		
		client.select(2);
		
		client.sadd('ip', req.socket.remoteAddress);
		
		client.hincrby('url', req.url, 1);
		
		client.quit();
		
		next();
	};
};