"use strict";
	const koa 		 = require('koa');
	const logger 	 = require('koa-log4js');
	const bodyparser = require('koa-bodyparser');
	const render 	 = require('koa-ejs');
	const util 		 = require('util');
	const path 		 = require('path');
	const os 		 = require('os');
	var config 	  	 = require('../bin/config');

module.exports = function(env){
	let app 	= new koa();
		config 	= config(env);
	
	//use template engine
	render(app, config.tpl);

	//rewrite render
	let sysRender = app.context.render;
	let defaultCfg = {
			js 					: [`lib/jq.js`,`lib/require.js`],
			css 				: [],
			h_description 		: 'des',
			h_keywords			: 'kw',
			h_title				: 'app',
			dns 		 		: config.dns,
			sysApi 	 	 		: config.api,
			jsServerAddr 		: config.jsserver,
			ResVer		 		: config.ver,
			ENV					: config.env,
		}

	if(env == 'dev'){
		app.use(bodyparser());
		config.enableLiveLoad && defaultCfg.js.push(`http://${getIp()}:35729/livereload.js??ver=1`);
	}	
	
	app.context.render = function(view,opt){
		return function*(){
			opt = opt || {};
			var o = Object.create(defaultCfg);
			extend(o,opt);
			yield sysRender.apply(this,[view,o]);
		}
	}

	//use router
	app.use('dev' == env?require('./middleware/router') : require('./middleware/distRouter'));

	return app;
};


function getIp(){
	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family === 'IPv4' && !address.internal) {
	            addresses.push(address.address);
	        }
	    }
	}
	return addresses[0];
}

function extend(o,n){
	for(var i in n){
		var val = n[i] || {};
		o[i] =  (Object.prototype.toString.call(val)=='[object Array]' && o[i])? o[i].concat(val) : val;
	}
}