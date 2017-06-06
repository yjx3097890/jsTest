var net = require("net"),
server = net.createServer(function (conn) {
	console.log("connected");
	
	conn.on("data", function (data) {
		console.log(data + " from" + conn.remoteAddress + ":" + conn.remotePort);
		conn.write("server收到： " + data);
	});
	
	conn.on("close", function () {
		console.log("client closed connection.");
	});
}).listen(9876);

console.log("server listening port 9876.");