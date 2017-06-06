var connect = require('connect'),
http = require('http'),
__dirname = './testPage';

 function clearSession(req, res, next) {
	if ( '/clear' === req.url) {
	
		req.session = null;
		res.statusCode = 302;
		res.setHeader('Location', '/');
		res.end();
	} else {
		next();
	}
 }
 
 function trackUser(req, res, next) {
	req.session.ct = req.session.ct || 0;
	req.session.username = req.session.username || req.cookies.username;
	console.log(req.session.username, "requested", req.session.ct);
	next();
 }

http.createServer(connect().use(connect.logger('dev')).
	use(connect.cookieParser('number')).
	use(connect.cookieSession({key: 'tracking'})).
	use(clearSession).use(trackUser).
	use(connect.static(__dirname, {redirect: true}))).listen(8124);
	
	