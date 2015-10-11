/**
 * Created by Urvesh on 10/7/15.
 */

var app = angular.module('controllers', []);

app.controller('NavCtrl', function($scope, $modal, $location) {
    $scope.authenticated = false;
    $scope.title = 'Welcome to the Main Page';

});

app.controller('MainCtrl', function($scope) {

});

app.controller('LoginCtrl', function($scope) {
    $scope.submit = function() {
        console.log('login');
        //make http post request

    }
});

app.controller('SignupCtrl', function($scope) {
    $scope.submit = function() {
        console.log('signup');
        //make http post request
    };


});

app.controller('DashboardCtrl', function($scope) {
    $scope.authenticated = true;
});

app.controller('AdminCtrl', function($scope) {
    $scope.authenticated = true;
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

});