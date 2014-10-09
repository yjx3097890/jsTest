var redis = require('redis'),
	http = require('http'),
	async = require('async'),
	jade = require('jade'),
	fs = require('fs');
	
var layout = fs.readFileSync(__dirname + '/jade/score.jade', {encoding : 'utf8'});
var jadeFn = jade.compile(layout, {filename: __dirname + '/jade/score.jade'})	

var client = redis.createClient();

client.select(5);

function createCallback(member) {
	return function (callback) {
		client.hgetall(member, function (err, obj) {
			callback(err, obj);
		});
	};
}

http.createServer(function (req, res) {
	if (req.url.indexOf('favicon.ico') !== -1 ) {
		res.writeHead(200, {'content-Type': 'image/x-icon'});
		fs.readFile(__dirname + '/jade/airplane.png', {encoding: 'utf8'}, function (err, data) {
			if (err) {
				res.end(err);
				return;
			}
			console.log(req.url)
			res.write(data);
			res.end();			
		});
		return;
	}
	
	client.zrevrange('Zowie!', 0, 5, function (err, data) {
		var scores;
		
		if (err) {
			 console.log(err);
			res.end('Top scores not currently available, please check back');
			return;
		}
		
		
		
		
		funcs = [];
		
		for (var i=0; i<data.length; i++) {
			funcs.push(createCallback(data[i]));
		}
		
		async.series(funcs, function (err, result) {
			if (err) {
				 console.log(err);
				res.end('series error', err);
				return;
			}
			var str = jadeFn({scores: result});
			res.end(str);
		});
	});
}).listen(3000);

