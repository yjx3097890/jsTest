var util = require("util"),
	eventEmitter = require('events').EventEmitter,
	fs = require('fs');
	
	function InputChecker (name, file) {
		this.name = name;
		this.writeStream = fs.createWriteStream('./'+file+'.txt', {
			flags: 'a',
			encoding: 'utf8',
			mode: 0666
		});
		
		this.on('write', function (data) {
			this.writeStream.write(data, 'utf8');
		});
		this.on('echo', function (input ) {
			console.log(input);
		});
		this.on('end', function ( ) {
			process.exit();
		});
	}
	
	util.inherits(InputChecker, eventEmitter);
	
	InputChecker.prototype.check = function (input) {
		var command = input.toString().trim().substr(0, 3);
		if (command === "wr:") {
			this.emit('write', input.substring(3));	
		} else if (command === "en:") {
			this.emit('end');
		} else {
		this.emit('echo', input);
		}
	};
	
	var ic = new InputChecker('yjx', 'eventTest');
	
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', function (data){
		ic.check(data);
	});
	