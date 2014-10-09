'use strict';

/**
 * @ngdoc function
 * @name angularwebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularwebApp
 */
angular.module('angularwebApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
