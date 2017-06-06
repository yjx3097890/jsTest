
// Declare app level module which depends on views, and

angular.module('LogApp', [
  'ngRoute', 'ngResource', 'd3', 'appControllers', 'appDirectives'
]).
config(['$routeProvider', '$provide', function($routeProvider, $provide) {

        $routeProvider.when('/', {
           redirectTo: '/login'
        }).when('/dashboard', {
            templateUrl: './dashboard.html',
            controller: 'DashboardCtrl'
        }).when('/login', {
          templateUrl: './login.html',
          controller: 'LoginCtrl'
        }).when('/error/:code', {
            templateUrl: './error.html',
            controller: 'ErrorCtrl'
        }).otherwise({
            redirectTo: '/error/404'
        });

        $provide.value('errors', {
            401: {
                message: '您没有权限访问。'
            },
            404: {
                message: '您访问的页面不存在。'
            },
            500: {
                message: '你的操作不当，使服务器错误。'
            }
        });
}]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['LogApp']);

});
