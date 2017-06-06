var express = require('express'),
	router = express.Router();
	
	//注意node？作用在e上
	router.get(/^\/node?(?:\/(\d+)(?:\.\.(\d+))?)?/, function (req, res) {
		console.log(req.params);
		res.send(req.params);
	});
	
	router.get('/content/*', function (req, res) {
		res.send(req.params);
	});
	
	router.get('/products/:id?/:operation?', function (req, res){
		res.send(req.params.operation+ ' ' + req.params.id);
	});
	 
	module.exports = router;