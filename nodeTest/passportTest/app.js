var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var client = require('mongodb').MongoClient;
var crypto = require('crypto');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

var app = express();

client.connect('mongodb://localhost:27017/testDb', function (err, db) {
    if (!err) {
        console.log('Cnnected');
    } else {
        return console.log('error: ', err);
    }

    db.collection('password', function (err, collection) {
        passport.use(new localStrategy(function (user, password, done) {
            collection.findOne({
                username: user
            }, function (err, result) {
                if (err) return done(err);

                if (!result) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                var hashPwd = crypto.createHash('sha512').
                update(result.salt+password).
                digest('hex');
                 if (hashPwd!==result.password) {
                    return done(null, false, { message: 'Incorrect password.' });
                 }

                return done(null, result);
            //    db.close();
            });
        }));

        //每次请求时，根据session中的user标识，去查询user的所有信息
        passport.deserializeUser(function (username, done) {
            collection.findOne({
                username: username
            }, function (err, result) {
            //    if (err) return done(err);

                return done(err, result);
            //    db.close();
            });
        });
    });
});

passport.serializeUser(function (user, done) {
    done(null, user.username)
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('keyboard cat'));
app.use(session({ secret: 'keyboard cat'}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', routes);
app.use('/login', login);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
