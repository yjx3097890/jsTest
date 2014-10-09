var fs = require('fs');

try {
	var data = fs.readFile('./apples.test','utf8', function (err, data) {	
if (err) throw err;
	console.log(data);
		var adjData = data.replace(/[A|a]pple/g, 'orange');
		fs.writeFile('./oranges.txt', adjData, function (err) {
		if (err) throw err;
		});
	});
} catch (error) {
	console.log(error);
}