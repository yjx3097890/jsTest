'use strict';
const fetch = require('../sys/middleware/fetch');
const dep = require('../sys/middleware/tsDP/build');

module.exports = {
    '/': function * () {
        //get interface data
    	// var int = {
    	// 	data : 'http://localhost:3001/service/com.a.b/testService/bb'
    	// }
    	// var data = yield fetch.get(int);
        
        // parse typescript dependency
       	// let deps = dep('/User/joe/Download/src','/Users/joe/Downloads/src/Main.ts')
        
        //render page
        yield this.render('index', {
            css  : ['css/index.css'],
            data : {a:Math.random()}
        });
    }
}