// load http module
var http = require('http');
var fs = require('fs');
// create http server
http.createServer(function (req, res) {
	
	var query = require('url').parse(req.url).query;
	
	console.log(query);

	var file = require('querystring').parse(query).file;
	
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	for (var i=0; i<100; i++) {
		res.write(i+'\n');
	}
	
	var data = fs.readFileSync(file,'utf-8');
	res.write(data);
	res.end();
   
}).listen('./node-server-sock'); //linux下才可用
