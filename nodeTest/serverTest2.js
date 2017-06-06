var crossroads = require('crossroads'),
	http = require('http'),
	connect = require('connect'),
	fs = require('fs'),
	httpProxy= require('http-proxy');
	
	var proxy = httpProxy.createProxyServer();
	
	http.createServer(function (req, res) {
		if (req.url.match(/^\/node\//)) {
			proxy.web(req, res, {target:'http://localhost:8888'});
		} else {
			proxy.web(req, res, {target:'http://localhost:8889'});
		}	
	}).listen(9999);
	
	var route = crossroads.addRoute('/node/{id}');
	function onTypeAccess( id) {
		console.log('request: ',id);
	}
	
	route.matched.add(onTypeAccess);
	
	http.createServer(function (req, res) {
	console.log(req.url);
		crossroads.parse(req.url);
		res.end("processing");
	}).listen(8888);
	
	http.createServer(connect().use(connect.favicon()).
	use(connect.logger('dev')).use(connect.static(__dirname))).listen(8889);