var dgram = require('dgram');
var client = dgram.createSocket('udp4');

process.stdin.resume();

process.stdin.on('data', function (data) {
	console.log(data.toString('utf-8'));
	client.send(data, 0, data.length, 8123, 'localhost', function (e) {
		if (e) {
			console.log('error: '+e);
		}else {
			console.log("sucess");
		}
	});
});