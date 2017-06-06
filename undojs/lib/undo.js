/*
 * Undo.js - A undo/redo framework for JavaScript
 * 
 * http://jzaefferer.github.com/undo   命令模式的实现
 *
 * Copyright (c) 2011 Jörn Zaefferer
 * MIT licensed.
 */
(function() {

// based on Backbone.js' inherits， 一个继承方法，parent、child都是函数
var inherits = function(parent, protoProps) {
	var child;

	if (protoProps && protoProps.hasOwnProperty('constructor')) {
		child = protoProps.constructor;
	} else {
		child = function(){ return parent.apply(this, arguments); };
	}

	child.prototype = Object.create(parent.prototype);
	
	if (protoProps) extend(child.prototype, protoProps);
	
	child.prototype.constructor = child;
	child.__super__ = parent.prototype;
	return child;
};
//用ref扩展target
function extend(target, ref) {
	var name, value;
	for ( name in ref ) {
        if (ref.hasOwnProperty(name)) {
            value = ref[name];
            if (value !== undefined) {
                target[ name ] = value;
            }
        }
	}
	return target;
}

var Undo;
 //为兼容服务端
if (typeof exports !== 'undefined') {
	Undo = exports;
} else {
	Undo = this.Undo = {};
}

Undo.Stack = function() {
    //命令栈
	this.commands = [];
    //当前命令位置
	this.stackPosition = -1;
    //当前保存位置
	this.savePosition = -1;
};

extend(Undo.Stack.prototype, {
    //包装执行命令
	execute: function(command) {
        //清除之后的redo的命令
		this._clearRedo();
        //执行命令操作
		command.execute();
        //保存新的command对象
		this.commands.push(command);
        //当前命令位置+1
		this.stackPosition++;
		this.changed();  //改变相关状态
	},
    //取消命令
	undo: function() {
		this.commands[this.stackPosition].undo();
		this.stackPosition--;
		this.changed();
	},
    //判断是否有可取消的命令
	canUndo: function() {
		return this.stackPosition >= 0;
	},
    //重复取消的命令
	redo: function() {
		this.stackPosition++;
		this.commands[this.stackPosition].redo();
		this.changed();
	},
    //判断是否有可重复的命令
	canRedo: function() {
		return this.stackPosition < this.commands.length - 1;
	},
    //保存状态
	save: function() {
		this.savePosition = this.stackPosition;
		this.changed();
	},
    //是否有未保存的命令
	dirty: function() {
		return this.stackPosition != this.savePosition;
	},
    //清除当前命令位置之后的可以redo的命令
	_clearRedo: function() {
		this.commands.length = this.stackPosition + 1;
	},
    //每次执行命令栈操作后的更新
	changed: function() {
		// do nothing, override
	}
});

//命令的抽象构造函数
Undo.Command = function(name) {
	this.name = name;
};

var up = new Error("override me!");
//抽象构造函数应有的方法
extend(Undo.Command.prototype, {
	execute: function() {
		throw up;
	},
	undo: function() {
		throw up;
	},
	redo: function() {
		this.execute();
	}
});

//生成具体构造函数，继承自Undo.Command
Undo.Command.extend = function(protoProps) {
	var child = inherits(this, protoProps);
	child.extend = Undo.Command.extend;
	return child;
};
	
}).call(this);
