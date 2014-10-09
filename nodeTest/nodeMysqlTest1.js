var mysql = require('mysql');

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

client.query('insert into node ' +
	'set title=?, text=?, created=NOW()',
	['yanjixian', 'who is yanjixian'], function (err, result) {
		if (err) {
			console.dir( err);
		} else {
			console.dir(result);
			var id = result.insertId;
		}
		
		client.query('update node set ' + 
			'title=? where id = ?', ['new title', id], function (err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log('affect: '+ result.affectedRows+', change: ' + result.changedRows);
					
					client.query('delete from node where id = ?', [id], function (err, result ) {
						if (err) {
							console.log(err);
						} else {
							console.log('affect: '+ result.affectedRows+', change: ' + result.changedRows);
							
							showData();
						}
					});
					
					
				}
				
			});
		
		

});


function showData() {
	client.query('select * from node ORDER by id', function (err, result, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log(JSON.stringify(result));
			console.log(JSON.stringify(fields));
		}
		
		client.end();
	});
}