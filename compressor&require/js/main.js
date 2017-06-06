//只执行一个define



define(["./a", "b", "./c","app/d"], function(a, b, c,d) {
    a.decrement(this);
     console.dir(d);;
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

define ("zz",function () {
	//TODO
    console.log("zz");
	return {
		color : "red",
		size: 11
	};
});