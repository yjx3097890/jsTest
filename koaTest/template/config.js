"use strict";

let path = require('path');


module.exports = [{
	css :{
		to:`${__dirname}/build/css/`,
		from:`${__dirname}/dist/css`
	},
	js:[
	{
		from:`${__dirname}/resource/es5/lib/`,
		to:`${__dirname}/build/js/lib/`
	},
	{
		from:`${__dirname}/dist/js/page/test.js`,
		to:`${__dirname}/build/js/test.js`
	}],

	resource:{
		from:`${__dirname}/resource/images`,
		to:`${__dirname}/build/res/images/`
	},
	page:{
		to:`${__dirname}/build/index.html`,
		url:'http://localhost:3000/a',
		reg:{
			'/css/base.css' 	: './css/base.css',
			'/css/a.css' 		: './css/a.css',
			'/lib/require.js' 	: './js/lib/require.js',
			'/lib/zepto.js' 	: './js/lib/zepto.js',
			'page/test' 		: './js/test'
		}
	}
}]

