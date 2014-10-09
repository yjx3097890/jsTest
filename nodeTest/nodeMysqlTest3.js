var mysql = require('mysql');
var queues = require('mysql-queues');

var client = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: null
});

client.connect(function (err) {
	if (err) {
		console.log('err :' + err);
		return;
	}
	console.log('connected');
});

client.query('use nodetest');

//use debug true
queues(client, true);

var trans = client.startTransaction();

trans.query('insert into node (title, text, created) ' + 'values(?,?,now())', 
	['title for 8', '第八个'], function (err, info) {
		if (err) {
			trans.rollback();
		} else {
			console.log(info);
			
			trans.query('update node set title = ? where title = ?', ['new title for 8', 'title for 8'], function (err, info) {
				if (err) {
					trans.rollback();
				} else {
					console.log(info);
					trans.commit();
				}
			});
		}
	});
	
trans.execute();

	client.query('select * from node ORDER by id', function (err, result, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log(JSON.stringify(result));
			console.log(JSON.stringify(fields));
		}
		
		client.end();
	});