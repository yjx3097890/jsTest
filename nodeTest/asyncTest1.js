var fs = require('fs'),
	async = require('async'),
	dir = './testDir/';
	
var ws = fs.createWriteStream('./readDirAsync.log', {
	flags: 'r+',   //'r+':ֻ�滻ǰ���У�'w':�滻�ļ��������ݣ�'a':���ļ�ĩβ���
	encoding: 'utf8',
	mode: 0666
});
try {
	async.waterfall([
		function loadDir(callback) {
			fs.readdir(dir, function (err, files) {
				callback(err, files);
			});
		},
		function eachFile(files, callback) {
			files.forEach(function (file) {
				callback(null, file);
			});
		},
		function checkFile(file, callback) {
			fs.stat(dir + file, function (err, stat) {
				if (stat.isFile()) {
					callback(err, file);
				}
			});
		},
		function loadData(file , callback) {
			fs.readFile(dir + file, 'utf8', function (err, data) {
				callback(err, file, data);
			});
		},
		function replaceData(file ,data, callback) {
			var adjData = data.replace(/3/g, 'yjx3');
			callback(null, file, adjData);
		},
		function writeData(file, data, callback) {
			fs.writeFile(dir + file, data, 'utf8', function (err) {
				
				callback(err, file);
			});
		},
		function log(file, callback) {
			ws.write('changed: '+file+'\n', 'utf8', function (err) {
				callback(err, file);
			});
		}
	], function fina(err, result) {
		if (err) { throw err;}
		console.log('modify:' + result);
	});	
} catch (e) {
	console.log(e);
}	