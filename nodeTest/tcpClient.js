var net = require("net");

var client = new net.Socket();
client.setEncoding("utf-8");

client.connect('9876', 'localhost', function () {
	console.log("connect server.");
	client.write('who are you?');
});

process.stdin.resume();

process.stdin.on('data', function (data) {
	console.log(  data );   //±ÿ–Î”√toString ªÚ+
	client.write(data);
});

client.on('data', function (data) {
	console.log('client :' + data);
});

client.on('close', function () {
	console.log('connect is closed£°');
});

