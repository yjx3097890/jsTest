var proxy = require('http-proxy'),
	http = require('http');

	proxy.createServer({target:'http://localhost:9876'}).listen(9999);
	//访问9999会跳转到9876
	http.createServer(function (req, res) {

		res.writeHead(200, {'Content-type': 'text/plain'});
		res.write(JSON.stringify(req.headers, true, 4));
		res.end();
	}).listen(9876);
