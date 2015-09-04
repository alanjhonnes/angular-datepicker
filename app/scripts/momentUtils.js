'use strict';

angular.module('momentPicker').constant('moment', moment);

angular.module('momentPicker').factory('momentUtils', ['moment', function (moment) {

  return {
    createMoment: function createMoment(options, local){
      if(local){
        return options ? moment(options) : moment();
      }
      else {
        return options ? moment.utc(options) : moment.utc();
      }
    },
    getVisibleMinutes: function (date, step, local) {
      date = this.createMoment(date, local);
      var year = date.year();
      var month = date.month();
      var day = date.date();
      var hour = date.hour();
      var minutes = [];
      var minute, pushedMoment;
      for (minute = 0; minute < 60; minute += step) {
        pushedMoment = this.createMoment({year: year, month: month, day: day, hour: hour, minute: minute}, local);
        minutes.push(pushedMoment);
      }
      return minutes;
    },
    getVisibleHours: function (date, local) {
      date = this.createMoment(date, local);
      var year = date.year();
      var month = date.month();
      var day = date.date();
      var hours = [];
      var hour, pushedMoment;
      for (hour = 0; hour < 24; hour ++) {
        pushedMoment = this.createMoment({year: year, month: month, date: day, hour: hour}, local);
        hours.push(pushedMoment);
      }
      return hours;
    },
    getVisibleWeeks: function (date, local) {
      date = this.createMoment(date, local);
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
        week = this.getDaysOfWeek(date, local);
        weeks.push(week);
        date.add(7, 'days');
      }
      return weeks;
    },
    getDaysOfWeek: function (date, local) {
      date = this.createMoment(date, local);
      var year = date.year();
      var month = date.month();
      var day = date.date();
      var days = [];
      var pushedDate;
      for (var i = 0; i < 7; i++) {
        pushedDate = this.createMoment({year:year, month:month, date:day, hour:12}, local);
        pushedDate.weekday(i);
        pushedDate.hour(12);
        days.push(pushedDate);
        date.day(1);
      }
      return days;
    },
    getVisibleMonths: function (date, local) {
      date = this.createMoment(date, local);
      var year = date.year();
      var months = [];
      var pushedDate;
      for (var month = 0; month <= 11; month++) {
        pushedDate = this.createMoment({year:year, month:month, day:1, hour:12}, local);
        months.push(pushedDate);
      }
      return months;
    },
    getVisibleYears: function (date, local) {
      date = this.createMoment(date, local);
      var year = date.year();
      var years = [];
      var pushedMoment;
      for (var i = 0; i < 12; i++) {
        pushedMoment = this.createMoment({year: year, hour:12}, local);
        years.push(pushedMoment);
        year++;
      }
      return years;
    },

    isAfter: function (model, date, local) {
      return model.isAfter(this.createMoment(date, local));
    },
    isBefore: function (model, date, local) {
      return model.isBefore(this.createMoment(date, local));
    },
    isSameYear: function (model, date, local) {
      return model.isSame(this.createMoment(date, local), 'year');
    },
    isSameMonth: function (model, date, local) {
      return  model.isSame(this.createMoment(date, local), 'month');
    },
    isSameDay: function (model, date, local) {
      return model.isSame(this.createMoment(date, local), 'day');
    },
    isSameHour: function (model, date, local) {
      return  model.isSame(this.createMoment(date, local), 'hour');
    },
    isSameMinutes: function (model, date, local) {
      return model.isSame(this.createMoment(date, local), 'minute');
    },
    isValidDate: function (value) {
      return moment.isMoment(value);
    }
  };
}]);
