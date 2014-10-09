var util = require("util");

function first() {
	this.name = 'first';
	var that = this;
	this.test = function () {
		console.log(that.name);
	}
}
first.prototype.output = function () {
	console.log(this.name);
}

function second() {
	second.super_.call(this);
	this.name = 'second';
}

util.inherits(second, first);

function third(fn) {
	this.name = 'third';
	this.callMethod = fn;
}

var two = new second();
var three = new third(two.test);

two.test();
two.output();
three.callMethod();