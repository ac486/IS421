/**
 * Created by Urvesh on 10/7/15.
 */

angular.module('is421', [
    'ngRoute',
    'ui.bootstrap',
    'controllers',
    'ngMessages'
])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/', {
            templateUrl: 'partials/index.html',
            controller: 'MainCtrl'
        })
        .when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'SignupCtrl'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .when('/admin', {
            templateUrl: 'partials/admin.html',
            controller: 'AdminCtrl'
        })
}]);