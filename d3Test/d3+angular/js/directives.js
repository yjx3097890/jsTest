/**
 * Created by Yan Jixian on 2015/2/26.
 */

var testDirectives = angular.module('testDirectives', []);


testDirectives.directive('navbar', function () {

    function addClass(el, _class){
        el.className += ' '+ _class;
    }

    function removeClass(el, _class){
        var elClass = ' '+el.className+' ';
        while(elClass.indexOf(_class) != -1)
        elClass = elClass.replace(_class, '');
        el.className = elClass;
    }

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$on('$routeChangeStart', function(scope, next, current) {
                var lis = element.children();
                for (var i = 0, len = lis.length; i < len; i++) {
                    //lis[i].classList.remove('active');
                    removeClass(lis[i],'active');
                    if (next.originalPath && next.originalPath.indexOf(lis[i].children[0].hash.slice(1)) > -1 ) {
                        //lis[i].classList.add('active');
                        addClass(lis[i],'active');
                    }
                }
            });
        }
    }
});
