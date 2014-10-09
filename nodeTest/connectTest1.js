var connect = require('connect'),
	http = require('http');
	
	var app = connect().use(connect.favicon()).
		use(connect.logger()).use(function (req, res) {
			res.end('hello world');
		});
		
	http.createServer(app).listen(9876);