 var repl = require("repl"),
 net = require("net");
 repl.start("node>> ", null, function eval(cmd, context, filename, callback) {
	 console.log(cmd);
	
	 callback(null, cmd);
}, null, true);
 connections = 0;
 
 net.createServer(function (socket) {
  connections += 1;
  repl.start({
    prompt: "node via TCP socket> ",
    input: socket,
    output: socket
  }).on('exit', function() {
    socket.end();
  });
}).listen(5001);