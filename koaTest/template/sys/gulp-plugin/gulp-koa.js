"use strict";

const through 		= require('through');
const gutil 		= require('gulp-util');
const PluginError 	= gutil.PluginError;
const child_process = require('child_process');
const path 			= require('path');
const log4js 		= require('log4js'); 
const fs 			= require('fs');
let service 		= null;

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: path.resolve(__dirname,`../log/${new Date().getMonth()+1}-${new Date().getDate()}.log`), category: 'app' }
  ]
});

var logger = log4js.getLogger('app');

module.exports = function(env){

		return through(function(script){

			if (!script || typeof(script.path) !== "string") {
				throw new PluginError('koa', '缺少参数~~~', {showProperties: false});
			}

			if(service && service.kill){
				service.kill('SIGTERM');
			}
		
			service = child_process.spawn('node',[script.path]);

			service.stdout.on('data', function(data) {
		       	logger.info(data.toString()); 
		    });
		    service.stderr.on('data', function(data) {
		       	logger.error(data.toString()); 
		    });
		})
}
