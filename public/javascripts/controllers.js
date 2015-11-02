/**
 * Created by Urvesh on 10/7/15.
 */

var app = angular.module('controllers', []);

app.controller('NavCtrl', function($scope, $modal, $location, $http) {

    $scope.$watch(function() {
        return $location.path();
    }, function(path) {
        if (path !== '/login' && path !== '/' && path !== '/signup' && path !== '/confirmation' ) {
            $http({
                method: 'GET',
                url: '/api/authentication'
            }).then(function(response) {
                console.log(response);
            }, function(err) {
                console.log(err);
                window.location.href = '/login';
            });
        }
    });

    $scope.logout = function() {
        $http({
            method: 'POST',
            url: '/api/logout'
        }).then(function(response) {
            console.log(response);
            window.location.href = '/';
        }, function(err) {
            console.log(err);
        })
    }
});

app.controller('MainCtrl', function($scope) {

});

app.controller('LoginCtrl', function($scope, $location, $http) {
    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/api/login',
            data: {
                username: $scope.username,
                password: $scope.password
            }
        }).then(function(response) {
            console.log(response);
            window.location.href = '/dashboard';
            //$location.path('/dashboard');
        }, function(err) {
            console.log(err);
        });
    }
});

app.controller('ForgotUsernameCtrl', function($scope, $http) {

});

app.controller('ForgotPasswordCtrl', function($scope) {

});

app.controller('SignupCtrl', function($scope, $location, $http) {
    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/api/signup',
            data: {
                username: $scope.username,
                firstname: $scope.firstname,
                lastname: $scope.lastname,
                email: $scope.email,
                password: $scope.password,
                password2: $scope.password2
            }
        }).then(function(response) {
            console.log(response);
            window.location.href = '/confirmation';
            //window.location.href = '/dashboard';
            //$location.path('/dashboard');
        }, function(err) {
            console.log(err);
        })
    };
});

app.controller('ConfirmationCtrl', function($scope, $http, $location) {
    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/api/confirmation',
            data: {
                confirmation: $scope.confirmation
            }
        }).then(function(response) {
            console.log(response);
            $location.path('/login');
        }, function(err) {
            console.log(err);
        })
    }
});

app.controller('DashboardCtrl', function($scope) {
    
});

app.controller('ProfileCtrl', function($scope) {
    
});

app.controller('AdminCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/admin'
    }).then(function(response) {
        console.log(response);
        $scope.userList = response.data;

        for (var i = 0; i < $scope.userList.length; i++) {
            var user = $scope.userList[i];
            console.log(user.isAdmin)
            if (user.isAdmin === 1) {
                user.isAdmin = "1"
            } else {
                user.isAdmin = "0";
            }
        }
    }, function(err) {
        console.log(err);
        window.location.href = '/';
    });

    $scope.selectedAll = false;

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



    $scope.deleteUsers = function() {
        var selected = [];
        var users = $scope.userList;

        for (var i = 0; i < users.length; i++) {
            if (users[i].isSelected) {
                if (users[i].username === 'urvesh') {
                    continue;
                }
                selected.push(users[i].username);
            }
        }

        if (selected.length > 0 ) {
            $http({
                method: 'POST',
                url: '/api/admin/delete',
                data: selected
            }).then(function(response) {
                console.log(response);
            }, function(err) {
                console.log(err);
            })
        }
    };
    $scope.save = function() {
        var selected = [];
        var users = $scope.userList;

        for (var i = 0; i < users.length; i++) {
            if (users[i].isSelected) {
                if (users[i].username === 'urvesh') {
                    continue;
                }
                selected.push(users[i].username);
            }
        }

        if (selected.length > 0) {
            $http({
                method: 'POST',
                url: '/api/admin/save',
                data: selected
            }).then(function(response) {
                console.log(response);
            }, function(err) {
                console.log(err);
            })
        }
    }

});