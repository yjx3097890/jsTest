var fs = require('fs'),
path = './testDir/';

var ws = fs.createWriteStream('./readDirAsync.log', {
	flags: 'a',
	encoding: 'utf8',
	mode: 5
});
try {
	fs.readdir(path, function (e, datas) {
		if (e) { throw e; }
		var count = 0;
		datas.forEach(function every(name) {
			fs.stat(path + name, function (e, data) {
				if (e) throw e;
				if (data.isFile()) {
					fs.readFile(path + name, 'utf8', function (e, data) {
						if (e) throw e;
						var mdata = data.replace(/315644588/g, '3097890');
						
						fs.writeFile(path+name , mdata, function (e) {
							if (e) throw e;
							ws.write('modified ' + name + ' \n', 'utf8', function (e) {
								if (e) throw e;
								count ++;
								if (count === datas.length) ws.write("game over! \n", 'utf8');
							} );		
						});
					});
				}
			});
			console.log(every);
		});
		
	});
} catch (e) {
	console.log(e);
}