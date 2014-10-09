var dns = require('dns');

dns.lookup('www.baidu.com', function (err, ip) {
	if (err) throw err;
	console.log(ip);
});