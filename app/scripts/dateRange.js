'use strict';

var Module = angular.module('datePicker');

Module.directive('dateRange', function () {
  return {
    templateUrl: 'app/templates/daterange.html',
    restrict: 'E',
    scope: {
      start: '=',
      end: '=',
      minView: '@?',
      maxView: '@?'
    },
    link: function (scope, element, attrs) {

      /*
       * If no date is set on scope, set current date from user system
       */
      scope.start = new Date(scope.start || new Date());
      scope.end = new Date(scope.end || new Date());
      scope.minView = scope.minView || 'date';
      scope.maxView = scope.maxView || 'date';
      attrs.$observe('disabled', function(isDisabled){
          scope.disableDatePickers = !!isDisabled;
        });
      scope.$watch('start.getTime()', function (value) {
        if (value && scope.end && value > scope.end.getTime()) {
          scope.end = new Date(value);
        }
      });
      scope.$watch('end.getTime()', function (value) {
        if (value && scope.start && value < scope.start.getTime()) {
          scope.start = new Date(value);
        }
      });
    }
  };
});
