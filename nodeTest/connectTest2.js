var connect = require('connect'),
http = require('http'),
__dirname = './testPage';

http.createServer(connect().use(connect.logger()).
	use(connect.static(__dirname, {redirect: true})).
	use(connect.directory(__dirname))).listen(8124);
	
	