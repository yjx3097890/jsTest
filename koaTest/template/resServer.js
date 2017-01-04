	'use strict';
	const koa = require('koa');
	const serve = require('koa-static');
	let app = new koa();
	const path = require('path');
	let env = process.argv[2];
	env == 'dev' && app.use(require('koa-livereload')());
	 //use static file server
	app.use(serve(`${__dirname}/resource/`, {
	    maxage: 0,
	    compress: false
	}));
	 //use static file server
	app.use(serve(`${__dirname}/resource/es5/`, {
	    maxage: 0,
	    compress: false
	}));
	app.listen(3002);