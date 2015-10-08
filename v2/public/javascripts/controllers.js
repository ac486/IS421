/**
 * Created by Urvesh on 10/7/15.
 */

var app = angular.module('controllers', []);

app.controller('MainCtrl', function($scope, $modal) {
    $scope.title = 'Welcome to the Main Page';
    $scope.selectedLogin = true;
    $scope.animationsEnabled = true;

    $scope.open = function(openType) {
        //openType: 'login' or 'signup'

        if (openType === 'login') {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modals/login.html',
                controller: 'LoginCtrl'
            })
        } else if (openType === 'signup') {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modals/signup.html',
                controller: 'SignupCtrl'
            })
        }

    }

});

app.controller('LoginCtrl', function($scope, $modalInstance) {

});

app.controller('SignupCtrl', function($scope, $modalInstance) {

});