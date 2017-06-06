var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var stats = require('./my_modules/stats');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var test1 = require('./routes/test1');
var test2 = require('./routes/test2');

var app = express();

//connect MongoDb
mongoose.connect('mongodb://127.0.0.1/WidgetDb');
mongoose.connection.on('open', function () {
	console.log('connnected to mondodb');
});
mongoose.connection.on('error', function (err) {
	console.log("mongoose error : " + err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(stats());
app.use(favicon());
app.use(logger('dev'));
app.use(stylus.middleware({
	src: __dirname + '/views',
	dest: __dirname + '/public'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/test1', test1);
app.use('/widgets', test2);

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
