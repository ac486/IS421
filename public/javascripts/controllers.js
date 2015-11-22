/**
 * Created by Urvesh on 10/7/15.
 */

var app = angular.module('controllers', []);

app.controller('NavCtrl', function($scope, $modal, $location, $http) {

    $scope.logout = function() {
        $http({
            method: 'POST',
            url: '/logout'
        }).then(function(response) {
            console.log(response);
            window.location.href = '/login';
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
            url: '/login',
            data: {
                username: $scope.username,
                password: $scope.password
            }
        }).then(function(response) {
            console.log(response);
            window.location.href = '/dashboard';
        }, function(err) {
            console.log(err);
        });
    }
});

app.controller('ForgotUsernameCtrl', function($scope, $http, $location) {

    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/forgotUsername',
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
            url: '/forgotPassword',
            data: {
                username: $scope.username
            }
        }).then(function(response) {
            console.log(response);
            $location.path('/login');
        }, function(err) {
            console.log(err);
        })
    }
});

app.controller('SignupCtrl', function($scope, $location, $http, $routeParams) {
    var owner = $routeParams.username;
    if (owner) {
        $http({
            method: 'GET',
            url: '/owner',
            params: {
                username: owner
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
            url: '/signup',
            data: {
                owner: owner,
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
        }, function(err) {
            console.log(err);
        })
    };
});

app.controller('ConfirmationCtrl', function($scope, $http, $location) {
    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/confirmation',
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

app.controller('DashboardCtrl', function($scope, $http, $location, $modal) {
    $http({
        method: 'GET',
        url: '/api/dashboard'
    }).then(function(response) {
        console.log(response);
        $scope.message = response.data.message;
        $scope.user = response.data.user;
        $scope.projects = response.data.projects;
    }, function(err) {
        console.log(err);
        $location.path('/login');
    });

    $scope.openProjectModal = function(size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newProjectModal.html',
            controller: 'NewProjectModalCtrl',
            size: size
        });
    };

    $scope.addUser = function(email) {
        if (!email) return;

        $http({
            method: 'POST',
            url: '/api/project/addUser',
            data: {
                email: email
            }
        }).then(function(response) {
            console.log(response);

            // existing user cannot confirm if he wants to accept project invite
            //$location.path('/confirmAddUser')
        }, function (err) {
            console.log(err);
        });
    }
});

// Should user be able to confirm if they want to accept project invite ?
app.controller('ConfirmAddUserCtrl', function($scope, $http) {

});

app.controller('NewProjectModalCtrl', function($scope, $http, $modalInstance) {
    $scope.ok = function () {
        if (!$scope.title) return;

        $http({
            method: 'POST',
            url: '/api/project/create',
            data: {
                title: $scope.title
            }
        }).then(function (response) {
            console.log(response);
        }, function(err) {
            console.log(err);
        });

        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('ProjectCtrl', function($scope, $http, $routeParams, $location, $modal) {
    var projectId = $routeParams.projectId;
    $http({
        method: 'GET',
        url: 'api/project/' + projectId
    }).then(function(response) {
        console.log(response);
        $scope.tasks = response.data.tasks;
    }, function(err) {
        console.log(err);
        $location.path('/login');
    });

    $scope.openTaskModal = function(size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newTaskModal.html',
            controller: 'NewTaskModalCtrl',
            size: size,
            resolve: {
                projectId: function() {
                    return projectId;
                }
            }
        });
    };
});

app.controller('NewTaskModalCtrl', function($scope, $http, $modalInstance, projectId) {
    $scope.ok = function () {
        if (!$scope.title) return;

        $http({
            method: 'POST',
            url: 'api/project/' + projectId + '/task/create',
            data: {
                title: $scope.title,
                description: $scope.description
            }
        }).then(function (response) {
            console.log(response);
        }, function (err) {
            console.log(err);
        });
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
});

app.controller('ProfileCtrl', function($scope, $http, $location) {
    $http({
        method: 'GET',
        url: '/api/user'
    }).then(function(response) {
        console.log(response);
        $scope.user = response.data.user;
    }, function(err) {
        $location.path('/login');
        console.log(err);
    })
    
});

app.controller('AdminCtrl', function($scope, $http, $location) {

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
        }, function(err) {
            console.log(err);
            window.location.href = '/login';
        });
    }

    $scope.selectedAll = false;

    $scope.all = function() {
        $scope.selectedAll = !$scope.selectedAll;
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
            } else {
                selectedCount--;
            }
        }
        if (selectedCount != $scope.userList.length) {
            $scope.selectedAll = false;
        } else if (selectedCount === $scope.userList.length) {
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
    };

    $scope.loginAs = function(username) {
        $http({
            method: 'POST',
            url: '/api/loginas',
            data: {
                username: username,
                password: 'test'    // can't be empty
            }
        }).then(function (response) {
            console.log(response);
            $scope.username = response.data.user.username;
            $location.path('/dashboard');
        }, function (err) {
            console.log(err);
        })
    }
});