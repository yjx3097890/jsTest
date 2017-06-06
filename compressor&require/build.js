define ('a',{
	color : "red",
	size : "12px",
    decrement: function (a) {
        return --a;
    }
});

//命名没啥用，必须和路径文件名相同
define ("b", [],function () {
	//TODO
    console.log("aa");
	return {
		color : "red",
		size: 11
	};
});
define ('as',{
	color : "aa",
	size : 10,
    decrement: function (a) {
        return --a;
    }
});

define('c',["a", "as"],
    function(a, aa) {
        
        //It gets or sets the window title.
        return function(title) {
            return title ? (window.title = title) :
                   console.log(aa);
        }
    }
);
//commonjs风格
define ('app/d',['require','exports','module','as','../a'],function (require, exports, module) {
    var aa = require("as");
    a =  require("../a");

    console.log(aa.color, a.color);
    exports.test = {dd: "ss"};
});

//只执行一个define



require(["./a", "b", "./c","app/d"], function(a, b, c,d) {
    a.decrement(this);
     console.dir(d);
    c();
        return {
            color: "blue",
            size: "large",
            addToCart: function() {
                a.decrement(this);
                b.add(this);
            }
        }
    }
);

define ("zz",[],function () {
	//TODO
    console.log("zz");
	return {
		color : "red",
		size: 11
	};
});
