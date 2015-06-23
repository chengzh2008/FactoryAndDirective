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
  .directive('debug', function () {
    var defaultType = "json";

    return {
      scope: {
        value: '=debug'
      },
      template: function (tElement, tAttrs) {
        var type = tAttrs['type'] || defaultType;
        var tpl;
        switch (type) {
          case "json":
            tpl = '<pre ng-bind="value | json"></pre>';
            break;
          case "type":
            tpl = '<pre>Type: {{value | type}}</pre>';
            break;
          case "array":
            var innerType = tAttrs['innerType'] || defaultType;
            tpl = '<div ng-repeat="el in value" debug="el" type="' + innerType + '">{{el}}</div>';
            break;
          case "full":
            tpl = '<div debug="value" type="type"></div><div debug="value" type="json"></div>';
            break;
          default:
            tpl = '<b>Unknown debug type "' + type + '" for</b><pre>{{value}}</pre>';
            break;
        }
        return tpl;
      }
    }
  });