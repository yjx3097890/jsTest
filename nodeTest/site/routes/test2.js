var express = require('express');
var router = express.Router();
var Widget = require('../models/widget');


//必须放'/:sn'的前面
router.get('/new', function (req, res) {
	var filepath = require('path').normalize(__dirname + '/../public/widgets/new.html');
	//var filepath = __dirname + '/../public/widgets/new.html' ; //不容许用..
	
	res.sendfile(filepath);
});

router.get('/:sn', function (req, res) {
	var sn = parseInt(req.params.sn);
	if (isNaN(sn)) return;
	Widget.findOne({sn:sn}, function (err, doc) {
		if (err) {
			res.send('no widget with sn : ' + req.params.sn);
		} else {
			res.render('widgets/show', {title: 'widget', widget: doc});
		}
	});

});

router.get('/', function (req, res) {
	Widget.find(function (err, docs) {
		if (err) {
			res.send(err);
		} else {
			res.render('widgets/index', {title: 'Widgets', widgets: docs});
		}
	});
	
});


router.post('/add', function (req, res) {
	var widget = new Widget({
		sn: req.body.wsn,
		name: req.body.wname,
		price: req.body.wprice,
		description: req.body.wdesc
	})
	widget.save(function (err, data) {
		if (err) {
			res.send(err);
		} else {
			res.render( 'widgets/new', {title: 'widget added', widget: widget});
		}
	});
});

router.delete('/:sn/delete', function (req, res) {
	var sn = req.params.sn;
	Widget.remove({sn:sn}, function (err) {
	if (err) {
			res.send(err);
		} else {
			console.log('deleted ' + sn);
			res.send('deleted ' + sn);
		}
	});
	
});

router.get('/:sn/edit', function (req, res) {
		var sn = req.params.sn;
	Widget.findOne({sn:sn}, function (err, doc) {
		if (err) {
			res.send('no widget with sn : ' + req.params.sn);
		} else {
			res.render('widgets/edit', {title: 'edit', widget: doc});
		}
	});
});

router.put('/:sn/update', function (req, res) {
	var sn = req.params.sn;
	widget = {
		name: req.body.wname,
		price: req.body.wprice,
		description: req.body.wdesc
	};
	Widget.update({sn:sn}, widget, function (err) {
	if (err) {
			res.send('error occured updating widget with sn : ' + req.params.sn);
		} else {
			console.log("updated " + sn);
	res.send(' updated ' + sn);
		}
	});
	
});

module.exports = router;