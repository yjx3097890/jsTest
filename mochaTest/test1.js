var assert = require('assert');
var fs = require('fs');

describe('array', function () {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not present', function () {
			assert.equal(-1, [1, 2, 3].indexOf(5));
			assert.equal(-1, [1, 2, 3].indexOf(0));
		});
	});
});

describe('fs', function () {
	describe('readFile', function () {
		it('should err when file is not existed', function (done) {
			this.timeout(500); //设置超时时间ms
			fs.readFile('test1.js', 'utf-8', function (err, data) {
				assert.ifError(err);
				done();
			});
		});
		
	});
});