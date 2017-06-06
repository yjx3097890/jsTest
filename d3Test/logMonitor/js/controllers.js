/**
 * Created by Yan Jixian on 2015/1/26.
 */

var appControllers = angular.module('appControllers', []);

appControllers.controller('DashboardCtrl', ['$rootScope', '$scope', '$location', function ( $rootScope, $scope, $location) {
$scope.title = '系统信息'
  $scope.area = '山西';
  $scope.hide = true;
  $scope.showMenu = function () {
    if ($scope.hide ) {
      $scope.hide = false;
    } else {
      $scope.hide = true;
    }
  };
  $scope.date = new Date();
  $scope.clickDate = function (date) {
      $scope.date = date;
  };

$scope.barClick = function (d) {
  alert(d)
}
  $scope.storageData = [{
    name: '已使用',
    total: 0.7
  },{
    name: '未使用',
    total: 0.3
  }];

  $scope.uploadRankData = [
    {name: 'GTK1', count: 200*Math.random()},
    {name: 'GTK2', count: 200*Math.random()},
    {name: 'GTK3', count: 200*Math.random()},
    {name: 'GTK4', count: 200*Math.random()},
    {name: 'GTK6', count: 200*Math.random()},
    {name: 'GTK5', count: 200*Math.random()},
    {name: 'GTK7', count: 200*Math.random()},
    {name: 'GTK8', count: 200*Math.random()},
    {name: 'GTK9', count: 200*Math.random()},
    {name: 'GTK10', count: 200*Math.random()}
  ];

  $scope.logData = [
    {GTK1: [{
        time: '2015-5-6',
        count: 100* Math.random()
      },{
        time: '2015-5-7',
        count: 100* Math.random()
      },{
        time: '2015-5-8',
        count: 100* Math.random()
      },{
        time: '2015-5-9',
        count: 100* Math.random()
      },{
        time: '2015-5-10',
        count: 100* Math.random()
      },{
        time: '2015-5-11',
        count: 100* Math.random()
      },{
        time: '2015-5-12',
        count: 100* Math.random()
      },{
        time: '2015-5-13',
        count: 100* Math.random()
      },{
        time: '2015-5-14',
        count: 100* Math.random()
      },{
        time: '2015-5-15',
        count: 100* Math.random()
      }
    ]},
    {GTK2: [{
        time: '2015-5-6',
        count: 100* Math.random()
      },{
        time: '2015-5-7',
        count: 100* Math.random()
      },{
        time: '2015-5-8',
        count: 100* Math.random()
      },{
        time: '2015-5-9',
        count: 100* Math.random()
      },{
        time: '2015-5-10',
        count: 100* Math.random()
      },{
        time: '2015-5-11',
        count: 100* Math.random()
      },{
        time: '2015-5-12',
        count: 100* Math.random()
      },{
        time: '2015-5-13',
        count: 100* Math.random()
      },{
        time: '2015-5-14',
        count: 100* Math.random()
      },{
        time: '2015-5-15',
        count: 100* Math.random()
      }
    ]}
  ];

}]);

appControllers.controller('ErrorCtrl', ['$rootScope', '$scope', '$routeParams','errors', function ( $rootScope, $scope, $routeParams, errors) {
    var code = $routeParams.code;
    $scope.error = errors[code].message;
}]);

appControllers.controller('LoginCtrl', ['$rootScope', '$scope', function ( $rootScope, $scope) {

}]);
