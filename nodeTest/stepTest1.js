var fs = require('fs'),
step = require('step');

try {
	step(
		function readData () {
			fs.readFile('./testDir/a.txt', 'utf8', this);
		},
		function (e, data) {
			if (e) throw e;
			return data.replace(/3/g, 'yjx3');
		},
		function write (e, data) {
			if (e) throw e;
			fs.writeFile('./testDir/ac/a.txt', data.this);
		}
	);
} catch (e) {
	console.log(e);
}