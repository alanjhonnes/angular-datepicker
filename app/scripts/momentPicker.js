'use strict';

var Module = angular.module('datePicker', []);

Module.constant('momentPickerConfig', {
  template: 'app/templates/momentpicker.html',
  view: 'month',
  views: ['year', 'month', 'date', 'hours', 'minutes'],
  step: 5
});
//

Module.directive('momentPicker', ['momentPickerConfig', 'momentUtils',
  function momentPickerDirective(momentPickerConfig, momentUtils) {

    //noinspection JSUnusedLocalSymbols
    return {
      // this is a bug ?
      require: '?ngModel',
      template: '<div ng-include="template"></div>',
      restrict: 'AE',
      scope: {
        model: '=momentPicker',
        after: '=?',
        before: '=?',
        minView: '@?',
        maxView: '@?',
        minDate: '=?',
        maxDate: '=?',
        utc: '=?'
      },
      link: function (scope, element, attrs, ngModel) {

        var arrowClick = false;

        scope.date = new Date(scope.model || new Date());
        scope.minView = scope.minView || 'year';
        scope.maxView = scope.maxView || 'date';
        scope.views = momentPickerConfig.views.concat();
        scope.view = attrs.view || momentPickerConfig.view;
        scope.now = new Date();
        scope.template = attrs.template || momentPickerConfig.template;

        var step = parseInt(attrs.step || momentPickerConfig.step, 10);
        var partial = !!attrs.partial;

        //if ngModel, we can add min and max validators
        if (ngModel) {
          if (angular.isDefined(scope.minDate)) {
            var minVal;
            ngModel.$validators.min = function (value) {
              return !momentUtils.isValidDate(value) || angular.isUndefined(minVal) || value >= minVal;
            };
            scope.$watch('minDate', function (val) {
              minVal = val;
              ngModel.$validate();
            });
          }

          if (angular.isDefined(scope.maxDate)) {
            var maxVal;
            ngModel.$validators.max = function (value) {
              return !momentUtils.isValidDate(value) || angular.isUndefined(maxVal) || value <= maxVal;
            };
            scope.$watch('maxDate', function (val) {
              maxVal = val;
              ngModel.$validate();
            });
          }
        }
        //end min, max date validator

        scope.views = scope.views.slice(
          scope.views.indexOf(scope.maxView || 'year'),
          scope.views.indexOf(scope.minView || 'minutes') + 1
        );

        if (scope.views.length === 1 || scope.views.indexOf(scope.view) === -1) {
          scope.view = scope.views[0];
        }

        scope.setView = function (nextView) {
          if (scope.views.indexOf(nextView) !== -1) {
            scope.view = nextView;
          }
        };

        scope.setDate = function (date) {
          if (attrs.disabled) {
            return;
          }
          //scope.date = datePickerUtils.convertDateToUTC(date);
          scope.date = date;
          // change next view
          var nextView = scope.views[scope.views.indexOf(scope.view) + 1];
          if ((!nextView || partial) || scope.model) {

            scope.model = scope.date;
            //scope.model = new Date(scope.model || date);
            //if ngModel , setViewValue and trigger ng-change, etc...
            if (ngModel) {
              ngModel.$setViewValue(scope.date);
            }

            var view = partial ? 'minutes' : scope.view;
            //noinspection FallThroughInSwitchStatementJS
            switch (view) {
              case 'minutes':
                scope.model.setMinutes(scope.date.getMinutes());
              /*falls through*/
              case 'hours':
                scope.model.setHours(scope.date.getHours());
              /*falls through*/
              case 'date':
                scope.model.setDate(scope.date.getDate());
              /*falls through*/
              case 'month':
                scope.model.setMonth(scope.date.getMonth());
              /*falls through*/
              case 'year':
                scope.model.setFullYear(scope.date.getFullYear());
            }
            scope.$emit('setDate', scope.model, scope.view);
          }

          if (nextView) {
            scope.setView(nextView);
          }

          if (!nextView && attrs.autoClose === 'true') {
            element.addClass('hidden');
            scope.$emit('hidePicker');
          }
        };

        function update() {
          var view = scope.view;

          if (scope.model && !arrowClick) {
            scope.date = new Date(scope.model);
            arrowClick = false;
          }
          var date = scope.date;

          switch (view) {
            case 'year':
              scope.years = momentUtils.getVisibleYears(date);
              break;
            case 'month':
              scope.months = momentUtils.getVisibleMonths(date);
              break;
            case 'date':
              scope.weekdays = scope.weekdays || momentUtils.getDaysOfWeek();
              scope.weeks = momentUtils.getVisibleWeeks(date);
              break;
            case 'hours':
              scope.hours = momentUtils.getVisibleHours(date);
              break;
            case 'minutes':
              scope.minutes = momentUtils.getVisibleMinutes(date, step);
              break;
          }
        }

        function watch() {
          if (scope.view !== 'date') {
            return scope.view;
          }
          return scope.date ? scope.date.getMonth() : null;
        }

        scope.$watch(watch, update);

        scope.next = function (delta) {
          var date = scope.date;
          delta = delta || 1;
          switch (scope.view) {
            case 'year':
            /*falls through*/
            case 'month':
              date.setFullYear(date.getFullYear() + delta);
              break;
            case 'date':
              /* Reverting from ISSUE #113
               var dt = new Date(date);
               date.setMonth(date.getMonth() + delta);
               if (date.getDate() < dt.getDate()) {
               date.setDate(0);
               }
               */
              date.setMonth(date.getMonth() + delta);
              break;
            case 'hours':
            /*falls through*/
            case 'minutes':
              date.setHours(date.getHours() + delta);
              break;
          }
          arrowClick = true;
          update();
        };

        scope.prev = function (delta) {
          return scope.next(-delta || -1);
        };

        scope.isAfter = function (date) {
          return scope.after && momentUtils.isAfter(date, scope.after);
        };

        scope.isBefore = function (date) {
          return scope.before && momentUtils.isBefore(date, scope.before);
        };

        scope.isSameMonth = function (date) {
          return momentUtils.isSameMonth(scope.model, date);
        };

        scope.isSameYear = function (date) {
          return momentUtils.isSameYear(scope.model, date);
        };

        scope.isSameDay = function (date) {
          return momentUtils.isSameDay(scope.model, date);
        };

        scope.isSameHour = function (date) {
          return momentUtils.isSameHour(scope.model, date);
        };

        scope.isSameMinutes = function (date) {
          return momentUtils.isSameMinutes(scope.model, date);
        };

        scope.isNow = function (date) {
          var is = true;
          var now = scope.now;
          //noinspection FallThroughInSwitchStatementJS
          switch (scope.view) {
            case 'minutes':
              is &= ~~(date.getMinutes() / step) === ~~(now.getMinutes() / step);
            /*falls through*/
            case 'hours':
              is &= date.getHours() === now.getHours();
            /*falls through*/
            case 'date':
              is &= date.getDate() === now.getDate();
            /*falls through*/
            case 'month':
              is &= date.getMonth() === now.getMonth();
            /*falls through*/
            case 'year':
              is &= date.getFullYear() === now.getFullYear();
          }
          return is;
        };
      }
    };
  }]);
