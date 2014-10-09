var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/testDb', function (err, db) {
	if (!err) {
		console.log('connected.');
	}
	db.collection('mycollection', function (err, collection) {
		collection.remove(null, {w:1}, function (err, result) {
			if (err) return console.log(err);
			
			console.log('removed: ' + result);	
			
			var widget1 = {title: 'First Widget', 
				desc: 'great great great',
				price: 14.99
			};
			var widget2 = {title: 'Second Widget', 
				desc: 'great great great great',
				price: 29.99
			};
			var widget3 = {title: '3 Widget', 
				desc: 'great great great great',
				price: 39.99
			};
			collection.insert(widget1, {w:0});
			
			collection.insert([ widget2, widget3], {w:1, keepGoing: true}, function (err, result) {
				if (err) {
					console.log('err: ' + err);
				} else {
					console.log(result);
					db.close();
				}
			});		
		});
	});
});
