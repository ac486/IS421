/**
 * Created by Urvesh on 10/7/15.
 */

var app = angular.module('controllers', []);

app.controller('NavCtrl', function($scope, $modal, $location) {
    $scope.authenticated = false;
    $scope.title = 'Welcome to the Main Page';
    
    $scope.$watch(function() {
        return $location.path();
    }, function(path) {
        if (path === '/dashboard' || path === '/admin' || path === '/profile') {
            $scope.authenticated = true;
        } else {
            $scope.authenticated = false;
        }
    })

});

app.controller('MainCtrl', function($scope) {

});

app.controller('LoginCtrl', function($scope, $location) {
    $scope.submit = function() {
        var user = {
            username: $scope.username,
            password: $scope.password
        };

        var keys = Object.keys(user);
        var count = 0;

        for (var i = 0; i < keys.length; i++) {
            if (user[keys[i]]) {
                count++;
            } else {
                alert('All fields must be filled out');
                break;
            }
        }

        if (count === keys.length) {
            $location.path('/dashboard');
        }
        
        //make http post request

    }
});

app.controller('ForgotUsernameCtrl', function($scope) {

});

app.controller('ForgotPasswordCtrl', function($scope) {

});

app.controller('SignupCtrl', function($scope, $location) {
    $scope.submit = function() {
        var user = {
            username: $scope.username,
            firstName: $scope.firstname,
            lastName: $scope.lastname,
            email: $scope.email,
            password: $scope.password,
            password2: $scope.password2
        };
        
        var keys = Object.keys(user);
        var count = 0;
        for (var i = 0; i < keys.length; i++) {
            if (user[keys[i]]) {
                count++;
            } else {
                alert('All fields must be filled out and valid');
                break;
            } 
        }
        
        if (count === keys.length) {
            $location.path('/dashboard');
        }
    };


});

app.controller('DashboardCtrl', function($scope) {
    
});

app.controller('ProfileCtrl', function($scope) {
    
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