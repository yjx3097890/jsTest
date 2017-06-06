define ({
	color : "red",
	size : "12px"
});

define (function () {
	//TODO
	
	return {
		color : "red",
		size: 11
	};
});

define(["./cart", "./inventory"], function(cart, inventory) {
        //return an object to define the "my/shirt" module.
        return {
            color: "blue",
            size: "large",
            addToCart: function() {
                inventory.decrement(this);
                cart.add(this);
            }
        }
    }
);