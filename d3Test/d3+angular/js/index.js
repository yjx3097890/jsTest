
// Declare app level module which depends on views, and

var zhudelab = angular.module('testApp', [
  'ngRoute', 'ngResource', 'd3'
]).
config(['$routeProvider', '$provide', function($routeProvider, $provide) {



        $routeProvider.when('/login',{
            templateUrl: './login.html',
            controller: 'LoginCtrl'
        }).when('/', {
           redirectTo: '/dashboard'
        }).when('/dashboard', {
            templateUrl: './dashboard.html',
            controller: 'DashboardCtrl'
        }).when('/logs', {
            templateUrl: './syslogs/logs.html',
            controller: 'LogsCtrl'
        }).when('/error/:code', {
            templateUrl: './error.html',
            controller: 'ErrorCtrl'
        }).when('/articles', {
            templateUrl: './article/articles.html',
            controller: 'ArticlesCtrl'
        }).when('/articles/add', {
            templateUrl: './article/add.html',
            controller: 'ArticleAddCtrl'
        }).when('/articles/edit/:id', {
            templateUrl: './article/add.html',
            controller: 'ArticleEditCtrl'
        }).when('/agents', {
            templateUrl: './agent/agents.html',
            controller: 'AgentsCtrl'
        }).when('/agents/add', {
            templateUrl: './agent/add.html',
            controller: 'AgentAddCtrl'
        }).when('/agents/edit/:id', {
            templateUrl: './agent/add.html',
            controller: 'AgentEditCtrl'
        }).when('/agents/:id/customers', {
            templateUrl: './agent/customerList.html',
            controller: 'AgentCustomersCtrl'
        }).when('/agents/:id/agents', {
            templateUrl: './agent/agentList.html',
            controller: 'AgentAgentsCtrl'
        }).when('/agents/:id/assignAgents', {
            templateUrl: './agent/agentList.html',
            controller: 'AgentAssignCtrl'
        }).when('/users', {
            templateUrl: './user/users.html',
            controller: 'UsersCtrl'
        }).when('/users/add', {
            templateUrl: './user/add.html',
            controller: 'UserAddCtrl'
        }).when('/users/edit/:id', {
            templateUrl: './user/add.html',
            controller: 'UserEditCtrl'
        }).when('/houses', {
            templateUrl: './house/houses.html',
            controller: 'HousesCtrl',
            loadingBar: true,
            permission: rights.house
        }).when('/houses/add', {
            templateUrl: './house/add.html',
            controller: 'HouseAddCtrl',
            loadingBar: true,
            permission: rights.house
        }).when('/houses/edit/:id', {
            templateUrl: './house/add.html',
            controller: 'HouseEditCtrl',
            loadingBar: true,
            permission: rights.house
        }).when('/agents/customer/:id/orders', {
            templateUrl: './agent/orders.html',
            controller: 'OrdersCtrl',
            loadingBar: true,
            permission: rights.agent
        }).when('/agents/:id/customers/add', {
            templateUrl: './agent/addCustomer.html',
            controller: 'CustomerAddCtrl',
            permission: rights.agent
        }).when('/agents/:aid/customers/edit/:cid', {
            templateUrl: './agent/addCustomer.html',
            controller: 'CustomerEditCtrl',
            loadingBar: true,
            permission: rights.agent
        }).when('/goods', {
            templateUrl: './good/goods.html',
            controller: 'GoodsCtrl',
            loadingBar: true,
            permission: rights.good
        }).when('/goods/add', {
            templateUrl: './good/add.html',
            controller: 'GoodAddCtrl',
            permission: rights.good
        }).when('/goods/edit/:id', {
            templateUrl: './good/add.html',
            controller: 'GoodEditCtrl',
            loadingBar: true,
            permission: rights.good
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
}]).run(['authService', function (authService) {
        authService.setUser(appUser);
}]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['testApp']);

});
