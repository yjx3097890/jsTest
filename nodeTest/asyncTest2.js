var fs = require('fs'),
	async = require('async');
	
try {
	async.parallel([
		function data1(callback) {
			fs.readFile('./testDir/a.txt', 'utf8', function (err, data) {
				callback(err, data);
			});	
		},
		function data2(callback) {
			fs.readFile('./testDir/b.txt', 'utf8', function (err, data) {
				callback(err, data);
			});	
		},
		function data3(callback) {
			fs.readFile('./testDir/c.txt', 'utf8', function (err, data) {
				callback(err, data);
			});	
		},
	],function (err, data) {
		if (err) {throw err;}
		console.log(data);
	});
} catch (e) {
		console.log(e);
}	