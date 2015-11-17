/**
 * Created by Urvesh on 10/7/15.
 */

var app = angular.module('controllers', []);

app.controller('NavCtrl', function($scope, $modal, $location, $http) {

    $scope.logout = function() {
        $http({
            method: 'POST',
            url: '/api/logout'
        }).then(function(response) {
            console.log(response);
            window.location.href = '/login';
        }, function(err) {
            console.log(err);
        })
    }
});

app.controller('MainCtrl', function($scope, subdomain) {
    console.log(subdomain);
});

app.controller('LoginCtrl', function($scope, $location, $http, subdomain) {
    if (subdomain) {
        console.log('calling somethign');
        $http({
            method: 'GET',
            url: '/api/admin'
        }).then(function(response) {
            console.log(response);
        }, function(err) {
            console.log(err);
        })
    }
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

app.controller('ForgotUsernameCtrl', function($scope, $http, $location) {

    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/api/forgotUsername',
            data: {
                email: $scope.email
            }
        }).then(function (response) {
            console.log(response);
            $location.path('/login');
        }, function (err) {
            console.log(err);
        })
    }
});

app.controller('ForgotPasswordCtrl', function($scope, $http, $location) {
    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/api/forgotPassword',
            data: {
                username: $scope.username
            }
        }).then(function(response) {
            console.log(response);
            //$location.path('/login');
        }, function(err) {
            console.log(err);
        })
    }
});

app.controller('SignupCtrl', function($scope, $location, $http, $routeParams) {
    var host = $routeParams.username;
    if (host) {
        $http({
            method: 'GET',
            url: '/api/host',
            params: {
                username: host
            }
        }).then(function(response) {
            console.log(response);
        }, function(err) {
            $location.path('/signup');
            console.log(err);
        })
    }

    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/api/signup',
            data: {
                host: host,
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

app.controller('DashboardCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/dashboard'
    }).then(function(response) {
        console.log(response);
        $scope.message = response.data.message;
    }, function(err) {
        console.log(err);
    })
});

app.controller('ProfileCtrl', function($scope) {
    
});

app.controller('AdminCtrl', function($scope, $http) {

    onLoad();

    function onLoad() {
        $http({
            method: 'GET',
            url: '/api/admin'
        }).then(function(response) {
            console.log(response);
            var userList = response.data.data;
            $scope.currentUser = response.data.user;

            $scope.userList = userList;
            //for (var i = 0; i < userList.length; i++) {
            //    var user = userList[i];
            //}
        }, function(err) {
            console.log(err);
            window.location.href = '/';
        });
    }

    $scope.selectedAll = false;

    $scope.all = function() {
        for (var i = 0; i < $scope.userList.length; i++) {
            var user = $scope.userList[i];

            user.isSelected = $scope.selectedAll;
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
                onLoad();
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
                selected.push({
                    username: users[i].username,
                    isAdmin: users[i].isAdmin == 1 //boolean true otherwise false
                });
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