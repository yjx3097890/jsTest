var readline = require("readline");

var interface = readline.createInterface(process.stdin, process.stdout, null);

interface.question(">>what is your name?", function (answer) {
	console.log("you are name  is "+answer);
	interface.setPrompt(">>?");
	interface.prompt();
});

function closeInterface () {
	console.log("closing ...");
	process.exit();
}

interface.on('close', function(){
	closeInterface();
});

interface.on("line", function (cmd) {
	if (cmd.trim() === '.leave') {
		closeInterface();
		return;
	} else {
		console.log("your commond: "+cmd);
	}
	interface.setPrompt(">>?");
	interface.prompt();
});