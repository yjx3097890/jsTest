var fs = require('fs');

try {
	var data = fs.readFileSync('./apples.test','utf8');
	console.log(data);
	var adjData = data.replace(/[A|a]pple/g, 'orange');
	fs.writeFileSync('./oranges.txt', adjData);
} catch (error) {
	console.log(error);
}