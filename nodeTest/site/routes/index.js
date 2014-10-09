var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '阎继先' });
});

router.get('/layout', function(req, res) {
  res.render('layout', { title: '阎继先' });
});

router.get('/stats', function (req, res) {
	var client = redis.createClient();
	
	client.select(2);
	
	client.multi().
		smembers('ip').
		hgetall('url').
		exec(function (err, results) {
			var ips = results[0];
			var urls = results[1];
			
			
			res.render('stats', {title: 'Stats', ips: ips, urls: urls});
			
			client.quit();
			
		});
});

module.exports = router;
