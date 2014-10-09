process.nextTick(function () {
	console.log('tick1');
});

setImmediate(function () {
		console.log('immediate2');
		process.nextTick(function () {
			console.log('tick3');
		});
	});

process.nextTick(function () {
	console.log('tick2');
	setImmediate(function () {
		console.log('immediate1');
	});
});

	
	setImmediate(function () {
		console.log('immediate3');
	});
	
	console.log("normal");