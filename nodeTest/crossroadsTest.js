var crossroads = require('crossroads'),
	http = require('http');
	
	var typeRoute = crossroads.addRoute('/{type}/{id}');
	function onTypeAccess(type, id) {
		console.log(type,',',id);
	}
	
	typeRoute.matched.add(onTypeAccess);
	
	http.createServer(function (req, res) {
	console.log(req.url);
		crossroads.parse(req.url);
		res.end("processing");
	}).listen(9876);