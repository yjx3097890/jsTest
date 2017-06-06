"use strict";

let config = require('./config');
let http   = require('http');
let cp     = require('stream-cp');
var singleCp = require('fs-cp');
let path   = require('path');
let stream = require('stream');


config.forEach(item=>{

	if(!item.page.url)return;

	var req = http.get(item.page.url,(res)=>{

			res.setEncoding('utf8');
	        var data = '';
	        res.on('data', (chunk) => {
	        	data += chunk;
	         });
	         res.on('end', () => {
	        	build(data,item); 	
	        })
	     });
			

	req.on('error',(err)=>{
		console.log(err);                    
	})
})

function build(data,config){
	var css 	= config.css,
	js 			= config.js,
	resource 	= config.resource,
	page 		= config.page;

	//替换资源路径
	for(var i in page.reg){
		data = data.replace(i,page.reg[i]);
	}

	//拷贝文件
		
	//css
	cp(css.from,css.to,(file)=>{return file},(err)=>{console.log('css done')});
	cp(resource.from,resource.to,(file)=>{return file},(err)=>{console.log('resource done')});
	js.forEach(item=>{
		path.extname(item.from)  == '' ? 
		cp(item.from,item.to,(file)=>{return file},(err)=>{console.log('js done')}) :
		singleCp(item.from,item.to).then((err)=>{console.log(err)})
	})

	var s = new stream.Readable();
	s._read = function noop() {}; // redundant? see updat
	s.push(data);
	s.push(null);

	singleCp(s,page.to).then(err=>{console.log(err)})

}






