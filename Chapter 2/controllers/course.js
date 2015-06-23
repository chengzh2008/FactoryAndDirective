angular.module('course', ['ngSanitize'])
  .factory('feed', function ($http) {
    var loremIpsumUrl = 'http://www.randomtext.me/api/lorem/p-2/20-35';
    return {
      get: function () {
        return $http.get(loremIpsumUrl);
      }
    }
  })
  .controller('CourseCtrl', function ($scope, $timeout, feed) {
    $scope.feed = [];
    $scope.messages = [];

    $scope.addContent = function () {
      feed.get()
        .success(function (element) {
          $scope.feed.push({
            'content': element.text_out
          });
        })
        .error(function (err) {
          console.warn(err);
        });
    }

    $scope.remove = function (el) {
      $scope.feed = _.without($scope.feed, el);
    }

    $scope.onUpdate = function (item, action) {
      if (action == 'registered') {
        item.element.animate({
          backgroundColor: 'yellow'
        }, 500);

        setTimeout(function () {
          item.element.animate({
            backgroundColor: 'white'
          }, 500)
        }, 1000);
      } else {
        var mess = 'Goodbye item ' + item.id + '!';
        $scope.messages.push(mess);

        $timeout(function() {
          $scope.messages = _.without($scope.messages, mess);
        }, 1000);
      }
    }
  })
  .directive('contentHandler', function () {
    return {
      scope: {
        feed: '=contentHandler',
        onChange: '&'
      },
      controller: function ($scope) {
        var ctrl = this
          , _elements = []
          , onChange = angular.noop;

        // call when a child element is added to DOM
        ctrl.registerElement = function (id, element) {
          var el = {
            id: id,
            element: element
          };
          _elements.push(el);
          onChange(el, _elements, 'registered');
        }

        // call when an element is removed from DOM
        ctrl.removeElement = function (id) {
          var el = _.find(_elements, function (e) {
            return e.id == id;
          });
          if (el) {
            _elements = _.without(_elements, el);
            onChange(el, _elements, 'removed');
          };
        };

        // register function to receive updates whenever internal
        // content changes
        ctrl.onChange = function (fn) {
          onChange = fn || angular.noop;
        }
      },
      require: 'contentHandler',
      link: function ($scope, $element, $attrs, contentCtrl) {
        if ($scope.onChange && angular.isFunction($scope.onChange)) {
          var handler = function (element, elements, action) {
            $scope.onChange({
              element: element,
              action: action
            });
          }
          contentCtrl.onChange(handler);
        }
      }
    }
  })
  .directive('content', function () {
    return {
      require: '^contentHandler',
      link: function ($scope, $element, $attrs, contentCtrl) {
        var id = $attrs.contentId || $scope.$id;
        contentCtrl.registerElement(id, $element);

        $scope.$on('$destroy', function () {
          contentCtrl.removeElement(id);
        });
      }
    }
  });