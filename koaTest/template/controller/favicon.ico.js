'use strict';
var path = require('path');
var fs 	 = require('fs');
var cache;
module.exports = {
    '/': function * () {
    	this.body  = 1;
    }
}