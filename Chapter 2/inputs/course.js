angular.module('course', [])
  .controller('CourseCtrl', function ($scope) {
    $scope.user = {
      username: 'mrvdot',
      email: 'talkto@mrvdot.com',
      age: 25,
      id: 123
    };
  })
  .directive('knob', function () {
    return {
      template: '<input type="text" />',
      require: 'ngModel',
      link: function ($scope, $element, $attrs, ngModel) {
        var input;

        ngModel.$render = function () {
          var value = ngModel.$modelValue;
          if (angular.isUndefined(value)) {
            return;
          }
          if (!angular.isNumber(value)) {
            value = parseInt(value);
            if (isNaN(value)) {
              console.warn('Non numeric value passed in to knob, unable to render', ngModel.$modelValue);
              return;
            }
          }
          if (input) {
            input.val(value).trigger('change');
          } else {
            input = $element.find('input');
            var handler = function (v) {
              $scope.$apply(function () {
                ngModel.$setViewValue(v);
              });
            };
            input.val(value).knob({
              change: handler,
              release: handler
            });
          }
        }
      }
    }
  });