var express      = require('express')
var cookieParser = require('cookie-parser')

var session = require('express-session');

var app = express()
app.use(cookieParser())
app.use(session({secret: 'keyboard cat'}));   //session上的cookie用secret加标记


app.get('/', function(req, res) {
 
    var sess = req.session
	if (!sess.views) {
		sess.views = 0;
	}
  if (sess) {
		sess.views++;
		res.write('<p> ' + JSON.stringify(sess) + '</p>')
		res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
	}
	
	 res.end("Cookies: "+ JSON.stringify(req.cookies));
})

app.listen(8080);
