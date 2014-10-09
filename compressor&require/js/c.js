define(["a", "as"],
    function(a, aa) {
        
        //It gets or sets the window title.
        return function(title) {
            return title ? (window.title = title) :
                   console.log(aa);
        }
    }
);