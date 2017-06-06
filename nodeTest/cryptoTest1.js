var client = require('mongodb').MongoClient;
var crypto = require('crypto');

var username = process.argv[2];
var password = process.argv[3];

var salt = Math.round((new Date().valueOf() * Math.random())) + "";

var hashPwd = crypto.createHash('sha512').
    update(salt+password).
    digest('hex');

client.connect('mongodb://localhost:27017/testDb', function (err, db) {
    if (!err) {
        console.log('Cnnected');
    } else {
        return console.log('error: ', err);
    }

    db.collection('password', function (err, collection) {
        collection.insert({
            username: username,
            password: hashPwd,
            salt: salt
        }, {w:1}, function (err, result) {
            if (err) console.log(err);
                console.log(hashPwd);
            db.close();
        });

    });
});
