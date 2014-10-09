var fs = require('fs'),
	http = require('http'),
	mime = require('mime'),
	base = './testPage';
	
	http.createServer(function server(req, res) {
		var url = base + req.url;   //req.url 会自动加上'/'
		console.log(url);
		
		
		
		fs.exists(url, function (exist) {
		
			
	
			if (!exist) {
				res.statusCode = 404;
		//		res.writeHead(504); //与上一行等价
				res.write('<head><meta charset="utf-8"/></head>');  //同时该文件必须为utf-8编码
				res.write('无法找到页面。404', 'utf8');
				res.end();
			} else {
			
			fs.stat(url, function (err, stats) {
				if (stats.isFile()) {
					res.statusCode = 200;
					
					var type = mime.lookup(url);
					res.setHeader('content-type', type);
					
					var file = fs.createReadStream(url);
					file.on('open', function () {
						file.pipe(res);
					});
					file.on('error', function (e) {
						console.log(e);
					});
				} else {
					res.setHeader('content-type', 'text/html');
					res.write('<head><meta charset="utf-8"/></head>'); 
					res.write('<h2>文件列表</h2>')
					fs.readdir(url, function (err, files) {
						res.write('<ul>');
						var li, path;
						files.forEach(function (file) {
							path = url.substring(base.length);
							if (path.length > 1) {
								li = '<li><a href="'+ path + '/' + file+'">'+file+'</a></li>';
 							} else {
								li = '<li><a href="' + file+'">'+file+'</a></li>';
							}
							res.write(li);
						});
						res.write('</ul>');
						res.end();
					}); 
				
				}
			});
			
				
			}
		
		})
	}).listen(9876);
	console.log('server start in 9876');