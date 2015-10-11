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

app.controller('DashboardCtrl', function($scope) {

});

app.controller('AdminCtrl', function($scope) {
    $scope.selectedAll = false;
    $scope.userList = [
        {
            username: 'bob123',
            firstName: 'Bob',
            lastName: 'Henry',
            email: 'bob@henry.com',
            isAdmin: true
        },
        {
            username: 'kevin123',
            firstName: 'kevin',
            lastName: 'joe',
            email: 'kevin@joe.com',
            isAdmin: false
        },
        {
            username: 'fancy123',
            firstName: 'fancy',
            lastName: 'name',
            email: 'fancy@name.com',
            isAdmin: false
        }
    ];

    $scope.all = function() {
        for (var i = 0; i < $scope.userList.length; i++) {
            var user = $scope.userList[i];

            if ($scope.selectedAll) {
                user.isSelected = true;
            } else {
                user.isSelected = false;
            }
        }
    };

    $scope.selectUser = function() {
        var selectedCount = 0;
        for (var i = 0; i < $scope.userList.length; i++) {
            var user = $scope.userList[i];
            if (user.isSelected) {
                selectedCount++;
            }
        }

        if ($scope.selectedAll && selectedCount != $scope.userList.length) {
            $scope.selectedAll = false;
        } else if (!$scope.selectedAll && selectedCount === $scope.userList.length) {
            $scope.selectedAll = true;
        }
    };


    $scope.adminValues = ['a', 'b'];
});