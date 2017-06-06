var fs = require('fs'),
step = require('step'),
files;

try {
	step(
		function readData () {
			 fs.readdir('./testDir/', this);
		},
		function (e, data) {
			if (e) throw e;
			files = data;
			var group = this.group();
			data.forEach(function (name) {
				fs.readFile('./testDir/' + name , 'utf8', group());
			});
		},
		function write (e, data) {
			if (e) throw e;
			var adjestData;
			for (var i=0,len=files.length; i<len; i++) {
				adjestData = data[i].replace(/3/g, 'yjx3');
				fs.writeFile('./testDir/' + files[i], adjestData, 'utf8' ,this);
			}
		}
	);
} catch (e) {
	console.log(e);
}