/**
 * Created by Yan Jixian on 2015/1/26.
 */

var testControllers = angular.module('testControllers', []);





testControllers.controller('DashboardCtrl', ['$rootScope', '$scope', '$location', function ( $rootScope, $scope, $location) {

  $scope.greeting = "Resize the page to see the re-rendering";
   $scope.data = [
     {name: "Greg", score: 98},
     {name: "Ari", score: 96},
     {name: 'Q', score: 75},
     {name: "Loser", score: 48}
   ];

   $scope.showDetailPanel =  function(item) {
    $scope.$apply(function() {    //这里用apply是由于click事件的执行环境不是angular context
     
        $scope.detailItem = item;
    });
  };

}]);

testControllers.controller('ErrorCtrl', ['$rootScope', '$scope', '$routeParams','errors', function ( $rootScope, $scope, $routeParams, errors) {
    var code = $routeParams.code;
    $scope.error = errors[code].message;
}]);
