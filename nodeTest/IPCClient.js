// load http module
var http = require('http');

var options = {
	method: 'GET',
	socketPath: './node-server-sock',
	path: '/?file=test1.coffee'
};

var req = http.request(options, function (res) {
	console.log('STATUS ' + res.statusCode);
	console.log('Headers ' + JSON.stringify(res.headers));
	res.setEncoding('utf-8');
	res.on('data', function (chunk) {
		console.log('chunk o\' data: '+ chunk);
	});
});

req.on('error', function (e) {
	console.log('error: ' + e);
});

req.write('data\n');
req.write('data\n');
req.end();