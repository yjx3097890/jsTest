var cmd = require('child_process').spawn('cmd',['/c', 'dir\n']);

cmd.stdout.on('data', function (data) {
	console.log("out: "+ data);
});
cmd.stderr.on('data', function (data) {
	console.log("err: "+ data);
});
cmd.on('exit', function (code) {
	console.log('exited code: '+ code);
});