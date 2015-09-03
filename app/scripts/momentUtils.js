'use strict';

angular.module('momentPicker').constant('moment', moment);

angular.module('momentPicker').factory('momentUtils', ['moment', function (moment) {

  return {
    getVisibleMinutes: function (date, step) {
      date = moment.utc(date || null);
      var year = date.year();
      var month = date.month();
      var day = date.date();
      var hour = date.hour();
      var minutes = [];
      var minute, pushedMoment;
      for (minute = 0; minute < 60; minute += step) {
        pushedMoment = moment.utc({year: year, month: month, day: day, hour: hour, minute: minute});
        minutes.push(pushedMoment);
      }
      return minutes;
    },
    getVisibleHours: function (date) {
      date = moment.utc(date || null);
      var year = date.year();
      var month = date.month();
      var day = date.date();
      var hours = [];
      var hour, pushedMoment;
      for (hour = 0; hour < 24; hour ++) {
        pushedMoment = moment.utc({year: year, month: month, date: day, hour: hour});
        hours.push(pushedMoment);
      }
      return hours;
    },
    getVisibleWeeks: function (date) {
      if(date){
        date = moment.utc(date);
      }
      else {
        date = moment.utc();
      }
      var startMonth = date.month();
      var startYear = date.year();
      // set date to start of the week
      date.date(1);

      if (date.day() === 1) {
        // day is sunday, let's get back to the previous week
        date.day(-5);
      } else {
        // day is not sunday, let's get back to the start of the week
        date.day(date.day() - (date.day() - 1));
      }
      if (date.day() === 2) {
        // day is monday, let's get back to the previous week
        date.day(-6);
      }

      var weeks = [];
      var week;
      while (weeks.length < 5) {
        if (date.isSame(startYear, 'year') && date.isAfter(startMonth, 'month')) {
          break;
        }
        week = this.getDaysOfWeek(date);
        weeks.push(week);
        date.add(7, 'days');
      }
      return weeks;
    },
    getDaysOfWeek: function (date) {
      if(date){
        date = moment.utc(date);
      }
      else {
        date = moment.utc();
      }
      var year = date.year();
      var month = date.month();
      var day = date.date();
      var days = [];
      var pushedDate;
      for (var i = 0; i < 7; i++) {
        pushedDate = moment.utc({year:year, month:month, date:day});
        pushedDate.weekday(i);
        days.push(pushedDate);
        date.day(1);
      }
      return days;
    },
    getVisibleMonths: function (date) {
      date = moment.utc(date || null);
      var year = date.year();
      var months = [];
      var pushedDate;
      for (var month = 0; month <= 11; month++) {
        pushedDate = moment.utc({year:year, month:month, day:1});
        months.push(pushedDate);
      }
      return months;
    },
    getVisibleYears: function (date) {
      date = moment.utc(date || null);
      var year = date.year();
      var years = [];
      var pushedMoment;
      for (var i = 0; i < 12; i++) {
        pushedMoment = moment.utc({year: year});
        years.push(pushedMoment);
        year++;
      }
      return years;
    },

    isAfter: function (model, date) {
      return model.isAfter(moment.utc(date));
    },
    isBefore: function (model, date) {
      return model.isBefore(moment.utc(date));
    },
    isSameYear: function (model, date) {
      return model.isSame(moment.utc(date), 'year');
    },
    isSameMonth: function (model, date) {
      return model.isSame(moment.utc(date), 'year') && model.isSame(moment.utc(date), 'month');
    },
    isSameDay: function (model, date) {
      return model.isSame(moment.utc(date), 'month') && model.isSame(moment.utc(date), 'day');
    },
    isSameHour: function (model, date) {
      return model.isSame(moment.utc(date), 'day') && model.isSame(moment.utc(date), 'hour');
    },
    isSameMinutes: function (model, date) {
      return model.isSame(moment.utc(date), 'hour') && model.isSame(moment.utc(date), 'minute');
    },
    isValidDate: function (value) {
      return moment.isMoment(value);
    }
  };
}]);
