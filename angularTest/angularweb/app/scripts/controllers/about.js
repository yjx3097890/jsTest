'use strict';

/**
 * @ngdoc function
 * @name angularwebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularwebApp
 */
angular.module('angularwebApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
