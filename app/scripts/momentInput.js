'use strict';

var PRISTINE_CLASS = 'ng-pristine',
  DIRTY_CLASS = 'ng-dirty';

var Module = angular.module('momentPicker');

Module.constant('momentTimeConfig', {
  template: function (attrs) {
    return '' +
      '<div ' +
      'moment-picker="' + attrs.ngModel + '" ' +
      (attrs.view ? 'view="' + attrs.view + '" ' : '') +
      (attrs.maxView ? 'max-view="' + attrs.maxView + '" ' : '') +
      (attrs.autoClose ? 'auto-close="' + attrs.autoClose + '" ' : '') +
      (attrs.template ? 'template="' + attrs.template + '" ' : '') +
      (attrs.minView ? 'min-view="' + attrs.minView + '" ' : '') +
      (attrs.partial ? 'partial="' + attrs.partial + '" ' : '') +
      (attrs.step ? 'step="' + attrs.step + '" ' : '') +
      (attrs.local ? 'local="' + attrs.local + '" ' : '') +
      'class="date-picker-date-time"></div>';
  },
  format: 'yyyy-MM-dd HH:mm',
  views: ['date', 'year', 'month', 'hours', 'minutes'],
  dismiss: false,
  position: 'relative'
});

Module.directive('momentTimeAppend', function () {
  return {
    link: function (scope, element) {
      element.bind('click', function () {
        element.find('input')[0].focus();
      });
    }
  };
});

Module.directive('momentTime', ['$compile', '$document', '$filter', 'momentTimeConfig', '$parse', 'momentUtils',
  function ($compile, $document, $filter, momentTimeConfig, $parse, momentUtils) {
    var body = $document.find('body');
    var dateFilter = $filter('moment');

    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        var format = attrs.format || momentTimeConfig.format;
        var parentForm = element.inheritedData('$formController');
        var views = $parse(attrs.views)(scope) || momentTimeConfig.views.concat();
        var view = attrs.view || views[0];
        var index = views.indexOf(view);
        var dismiss = attrs.autoClose ? $parse(attrs.autoClose)(scope) : momentTimeConfig.autoClose;
        var local = attrs.local ? $parse(attrs.local)(scope) : momentTimeConfig.local;
        var picker = null;
        var position = attrs.position || momentTimeConfig.position;
        var container = null;

        if (index === -1) {
          views.splice(index, 1);
        }

        views.unshift(view);


        function formatter(value) {
          return dateFilter(value, format);
        }

        function parser() {
          return ngModel.$modelValue;
        }

        ngModel.$formatters.push(formatter);
        ngModel.$parsers.unshift(parser);

        if (angular.isDefined(attrs.minDate)) {
          var minVal = new Date(attrs.minDate);

          ngModel.$validators.min = function (value) {
            return !momentUtils.isValidDate(value) || angular.isUndefined(minVal) || value >= minVal;
          };
          attrs.$observe('minDate', function (val) {
            minVal = new Date(val);
            ngModel.$validate();
          });
        }

        if (angular.isDefined(attrs.maxDate)) {
          var maxVal = new Date(attrs.maxDate);
          ngModel.$validators.max = function (value) {
            return !momentUtils.isValidDate(value) || angular.isUndefined(maxVal) || value <= maxVal;
          };
          attrs.$observe('maxDate', function (val) {
            maxVal = new Date(val);
            ngModel.$validate();
          });
        }
        //end min, max date validator

        var template = momentTimeConfig.template(attrs);

        function updateInput(event) {
          event.stopPropagation();
          if (ngModel.$pristine) {
            ngModel.$dirty = true;
            ngModel.$pristine = false;
            element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
            if (parentForm) {
              parentForm.$setDirty();
            }
            ngModel.$render();
          }
        }

        function clear() {
          if (picker) {
            picker.remove();
            picker = null;
          }
          if (container) {
            container.remove();
            container = null;
          }
        }

        function showPicker() {
          if (picker) {
            return;
          }
          // create picker element
          picker = $compile(template)(scope);
          scope.$digest();

          scope.$on('setDate', function (event, date, view) {
            updateInput(event);
            if (dismiss && views[views.length - 1] === view) {
              clear();
            }
          });

          scope.$on('hidePicker', function () {
            element.triggerHandler('blur');
          });

          scope.$on('$destroy', clear);

          // move picker below input element

          if (position === 'absolute') {
            var pos = angular.extend(element.offset(), { height: element[0].offsetHeight });
            picker.css({ top: pos.top + pos.height, left: pos.left, display: 'block', position: position});
            body.append(picker);
          } else {
            // relative
            container = angular.element('<div date-picker-wrapper></div>');
            element[0].parentElement.insertBefore(container[0], element[0]);
            container.append(picker);
//          this approach doesn't work
//          element.before(picker);
            picker.css({top: element[0].offsetHeight + 'px', display: 'block'});
          }

          picker.bind('mousedown', function (evt) {
            evt.preventDefault();
          });
        }

        element.bind('focus', showPicker);
        //element.bind('blur', clear);
      }
    };
  }]);
