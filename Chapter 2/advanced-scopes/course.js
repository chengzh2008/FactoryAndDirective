angular.module('course', [])
  .controller('CourseCtrl', function ($scope) {
    $scope.log = [
      "my first message",
      "another message",
      "signing off"
    ];

    $scope.console = function (level, message) {
      console[level || 'log'](message);
    }

    $scope.store = function (message) {
      $scope.log.push(message);
    }
  })
  .directive('debug', function () {
    return {
      template: '<div>' + 
        '<input ng-model="message" />' + 
        '<select ng-model="level" ng-init="level = \'log\'">' + 
          '<option value="log">Log</option>' + 
          '<option value="warn">Warn</option>' + 
          '<option value="error">Error</option>' + 
          '<option value="debug">Debug</option>' + 
        '</select>' + 
        '<button ng-click="logger({level: level, message: message})">Log it</button>' + 
      '</div>',
      scope: {
        logger: '&'
      }
    }
  });