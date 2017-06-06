var net = require('net');

var server = net.createServer(function (socket) {
	socket.on('data', function (data) {
		console.log(data.toString());
		socket.write('你好.');
		
	});
	
	socket.on('end', function () {
		console.log('断开');
	});
	
	socket.write('欢迎光临。');
	socket.pipe(socket);
});

server.listen(8124, function () {
	console.log('connecting');
});