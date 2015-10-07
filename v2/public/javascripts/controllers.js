/**
 * Created by Urvesh on 10/7/15.
 */

angular.module('controllers', [])

.controller('MainCtrl', ['$scope', function($scope) {
    $scope.title = 'Welcome to the Main Page';
}])

.controller('SignupCtrl', ['$scope', function($scope) {
   $scope.title = 'Welcome to Signup Page';
}])