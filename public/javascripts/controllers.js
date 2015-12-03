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
            toastr.success('Logout Success');
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
            toastr.success('Login Success');
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
        }).then(function(response) {
            console.log(response);
            $location.path('/login');
            toastr.success('Username Sent');
        }, function(err) {
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
            toastr.success('Password Sent');
        }, function(err) {
            toastr.error('Something when wrong');
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
            toastr.success('Your are in!');
            console.log(response);
        }, function(err) {
            $location.path('/signup')
            toastr.error('Login Success');
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
            $location.path('/login');
            toastr.success('Your are in!');
            //window.location.href = '/confirmation';
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
            toastr.success('Your are Confirmed!');
        }, function(err) {
            console.log(err);
        })
    }
});

app.controller('DashboardCtrl', function($scope, $http, $location, $modal) {

    onLoad();

    function onLoad() {
        $http({
            method: 'GET',
            url: '/api/dashboard'
        }).then(function(response) {
            console.log(response);
            $scope.message = response.data.message;
            $scope.user = response.data.user;
            $scope.projects = response.data.projects;
            toastr.success('Welcome ' + $scope.message);

            //getUsers();
        }, function(err) {
            console.log(err);
            $location.path('/login');
            toastr.error('Oops!!');
        });
    }

    $scope.openProjectModal = function(size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newProjectModal.html',
            controller: 'NewProjectModalCtrl',
            size: size
        });

        modalInstance.result.then(function() {
            toastr.success('Task !!!');
            onLoad();
            getUsers();
        }, function() {
            console.log('Modal dismissed at: ' + new Date());
            toastr.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteProject = function(id) {
        $http({
            method: 'PUT',
            url: '/api/project/delete',
            data: {
                projectId: id
            }
        }).then(function(response) {
            toastr.error('project deleted');
            console.log(response);
            onLoad();
        }, function(err) {
            console.log(err);
        })
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
            toastr.success('New User was added!');
            console.log(response);

            // existing user cannot confirm if he wants to accept project invite
            //$location.path('/confirmAddUser')
        }, function(err) {
            console.log(err);
        });
    }
});

// Should user be able to confirm if they want to accept project invite ?
app.controller('ConfirmAddUserCtrl', function($scope, $http) {

});

app.controller('NewProjectModalCtrl', function($scope, $http, $modalInstance) {
    $scope.ok = function() {
        if (!$scope.title) return;

        $http({
            method: 'POST',
            url: '/api/project/create',
            data: {
                title: $scope.title,
                description: $scope.description
            }
        }).then(function(response) {
            toastr.success('New Project was added!');
            console.log(response);
        }, function(err) {
            toastr.error(err)
            console.log(err);
        });

        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('ProjectCtrl', function($scope, $http, $routeParams, $location, $modal) {
    var projectId = $routeParams.projectId;

    onLoad();

    function onLoad() {
        $http({
            method: 'GET',
            url: 'api/project/' + projectId
        }).then(function(response) {
            console.log(response);
            var tasks = response.data.tasks;

            $scope.newTasks = [];
            $scope.wipTasks = [];
            $scope.doneTasks = [];
            $scope.selectedTasks = [];

            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];

                if (task.status === 'new') {
                    $scope.newTasks.push(task);
                } else if (task.status === 'wip') {
                    $scope.wipTasks.push(task);
                } else if (task.status === 'done') {
                    $scope.doneTasks.push(task);
                }
            }
        }, function(err) {
            console.log(err);
            $location.path('/login');
        });
    }

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
        modalInstance.result.then(function() {
            onLoad();
        })
    };


    $scope.changeStatus = function(task) {
        if (task.selected) {
            $scope.selectedTasks.push(task.taskId);
        } else {
            var index = $scope.selectedTasks.indexOf(task.taskId);
            $scope.selectedTasks.splice(index, 1);
        }
    };

    $scope.updateStatus = function(status) {
        $http({
            method: 'PUT',
            url: 'api/project/' + projectId + '/task/status',
            data: {
                tasks: $scope.selectedTasks,
                status: status
            }
        }).then(function(response) {
            console.log(response);
            onLoad();
        }, function(err) {
            console.log(err);
        })
    }
});

app.controller('NewTaskModalCtrl', function($scope, $http, $modalInstance, projectId) {
    $scope.ok = function() {
        if (!$scope.title) return;

        $http({
            method: 'POST',
            url: 'api/project/' + projectId + '/task/create',
            data: {
                title: $scope.title,
                description: $scope.description
            }
        }).then(function(response) {
            toastr.success('task added');
            console.log(response);
        }, function(err) {
            console.log(err);
        });
        $modalInstance.close();
    };

    $scope.cancel = function() {
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

        if (selected.length > 0) {
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
                password: 'test' // can't be empty
            }
        }).then(function(response) {
            console.log(response);
            $scope.username = response.data.user.username;
            $location.path('/dashboard');
        }, function(err) {
            console.log(err);
        })
    }
});

app.controller('ManageUsersCtrl', function($scope, $http) {
    //$scope.myUsers = [];
    //$scope.otherUsers = [];


    onLoad();

    function onLoad() {
        $http({
            method: 'GET',
            url: '/api/users/all'
        }).then(function(response) {
            console.log(response);
            $scope.user = response.data.user;
            var userList = response.data.userList;

            $scope.myUsers = [];
            $scope.otherUsers = [];

            for (var i = 0; i < userList.length; i++) {
                var currUser = userList[i];
                if (currUser.owner === $scope.user.username) {
                    $scope.myUsers.push(currUser);
                } else if (!currUser.owner) {
                    // no owner, means they are admin, we dont want to assign admin under admin
                } else {
                    $scope.otherUsers.push(currUser);
                }
            }

        }, function(err) {
            console.log(err);
            window.location.href = '/login';
        });
    }

    $scope.addUser = function(email) {
        $http({
            method: 'POST',
            url: '/api/project/addUser',
            data: {
                email: email
            }
        }).then(function(response) {
            console.log(response);
            onLoad();
        }, function(err) {
            console.log(err);
        });
    };

    $scope.removeUser = function(email) {
        $http({
            method: 'POST',
            url: '/api/project/removeUser',
            data: {
                email: email
            }
        }).then(function(response) {
            console.log(response);
            onLoad();
        }, function(err) {
            console.log(err);
        })
    }
});
