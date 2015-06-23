angular.module('course', [])
  .controller('CourseCtrl', function ($scope) {
    $scope.user = {
      username: 'mrvdot',
      email: 'talkto@mrvdot.com',
      id: 123
    };

    $scope.log = [
      "my first message",
      "another message",
      "signing off"
    ];

    var types = ['json', 'full', 'array'];

    $scope.console = [
      {
        value: $scope.log
      },
      {
        type: 'full',
        value: $scope.user
      },
      {
        type: 'array',
        value: $scope.log,
        innerType: 'full'
      }
    ];

    $scope.newTypes = function () {
      for (var i = 0, ii = $scope.console.length; i < ii; i++) {
        var idx = _.random(types.length - 1);
        $scope.console[i].type = types[idx];
      }
    }
  })
  .filter('type', function () {
    return function (val) {
      var type = typeof(val);
      if (type === 'object') {
        return Object.prototype.toString.call(val);
      } else {
        return type;
      }
    }
  })
  .directive('debug', function ($compile) {
    var defaultType = "json";

    return {
      link: function ($scope, $element, $attrs) {
        var setContent = function (type) {
          var tpl;
          type = type || defaultType;
          switch (type) {
            case "json":
              tpl = '<pre ng-bind="value | json"></pre>';
              break;
            case "type":
              tpl = '<pre>Type: {{value | type}}</pre>';
              break;
            case "array":
              var innerType = $attrs.innerType || defaultType;
              tpl = '<div ng-repeat="el in value" debug="el" type="' + innerType + '">{{el}}</div>';
              break;
            case "full":
              tpl = '<div debug="value" type="type"></div><div debug="value" type="json"></div>';
              break;
            default:
              tpl = '<b>Unknown debug type "' + type + '" for</b><pre>{{value}}</pre>';
              break;
          }
          $compile(tpl)($scope, function (el) {
            $element.html('').append(el);
          });
        };

        $attrs.$observe('type', setContent);
      },
      scope: {
        value: '=debug'
      }
    }
  });