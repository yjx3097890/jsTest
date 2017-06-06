//commonjs风格
define (function (require, exports, module) {
    var aa = require("as");
    a =  require("../a");

    console.log(aa.color, a.color);
    exports.test = {dd: "ss"};
});
