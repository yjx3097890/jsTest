 var glVal;
exports.setVal = function (val) {
	glVal = val;
};
exports.getVal = function () {
	console.log(global);
	console.log(process.execPath);
	return glVal;
}
	

