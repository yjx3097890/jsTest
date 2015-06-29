/**
 * Created by Yan Jixian on 2015/1/23.
 */

var appFilters = angular.module('appFilters', []);

appFilters.filter('addRatio', function() {
    return function(input, arg) {
        if (!arg || !input) {
            return input;
        }
        var index = input.lastIndexOf('.');
        return input.substring(0, index) + arg + input.substring(index);
    };
});
