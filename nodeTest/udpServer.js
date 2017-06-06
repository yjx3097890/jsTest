var dgram = require('dgram');

var server = dgram.createSocket('udp4');

server.on('message', function (msg, info) {
	console.log("Message: "+msg+" from "+ info.address+":"+info.port);
});
server.bind(8123);