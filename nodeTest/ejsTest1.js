var http = require('http'),
	ejs = require('ejs');
	
	http.createServer(function (req, res) {
		res.writeHead(200, {'content-type': 'text/html'});
		
		var title = 'test ejs',
		names = ['lili', 'lucy', 'tom'];
		
		ejs.renderFile(__dirname + '/ejsTest1.ejs', {title: title, names: names}, 		function (err, html) {
				if (err) {
					res.end(err);
				} else {
					res.end(html);
				}
			});
		
	}).listen(9876, function () {
		console.log(arguments, 'server start on port 9876.');
	});