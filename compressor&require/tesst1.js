(function () {
    var initializing = false, fnTest = /xyz/.test(function () {
        xyz;
    }
    ) ? /\b_super\b/ : /.*/;
    this.Class = function () {
    };
    inta = "十大爱上";
    Class.extend = function (prop) {
        var _super = this.prototype;
        //Class.prototype 非的故事发生
         initializing = true;
        var prototype =  new this ();
         initializing = false;
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function (name, fn) {
                return function () {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            }
            )(name, prop[name]) : prop[name];
        }
        function Class() {
            if (!initializing && this.init) {
                alert(this);
                this.init.apply(this, arguments);
            }
        }
        Class.prototype = prototype;
        Class.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
    };
}
)();
