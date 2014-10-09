var showMem = function () {
	var mem = process.memoryUsage();
	var format = function (bytes) {
		return (bytes / 1024 / 1024 ).toFixed(2) + "MB";
	}
	console.log('堆内存: '+ format(mem.heapTotal) + ' 已用堆内存: '+ format(mem.heapUsed) + ' 进程常驻内存: ' + format(mem.rss));
	console.log('----------------------------------------------------');
};

var useMem = function () {
	var size = 20 * 1024 * 1024;
//	var arr = new ArrayBuffer(size);
//	var intarr = new Int32Array(arr);
	var intarr = new Array(size);
	for ( var i=0; i< intarr.length; i++) {
		intarr[i] = 0;
	}
	return intarr;
};

var total = [];

for (var j=0; j< 15; j++) {
	showMem();
	total.push(useMem());
}

showMem();