 "use strict";

var fetch = require('../../sys/middleware/fetch.js');

var instance = null;

class testService{

	constructor(){
		
	}
	
	aa (params,koa) {
		return function*(){
			var data = yield fetch.get({
				a:'http://localhost:3001/service/com.a.b/testService/bb'
			});

			return data;
		}
	}
	bb(){
		return [{a:Math.random()}]
	}
}


module.exports = function(){
	if(!instance){
		return new testService();
	}else{
		return instance;
	}
}
