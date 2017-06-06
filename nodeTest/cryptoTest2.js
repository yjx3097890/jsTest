var client = require('mongodb').MongoClient;
var crypto = require('crypto');

var username = process.argv[2];
var password = process.argv[3];

var salt = Math.round((new Date().valueOf() * Math.random())) + "";


client.connect('mongodb://localhost:27017/testDb', function (err, db) {
    if (!err) {
        console.log('Cnnected');
    } else {
        return console.log('error: ', err);
    }

    db.collection('password', function (err, collection) {
        collection.findOne({
            username: username,
        }, function (err, result) {
            if (err) console.log(err);
                console.log();
            var hashPwd = crypto.createHash('sha512').
            update(result.salt+password).
            digest('hex');
            if (hashPwd === result.password) {
                console.log('OK, Passed!');
            } else {
                console.log("sorry! password is wrong.");
            }
            db.close();
        });

    });
});
