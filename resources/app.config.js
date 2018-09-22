angular.module("movies").config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl : "/components/home/home.html",
        controller : "HomeController",
        controllerAs : "homeVm"
    }).otherwise({
        redirectTo: '/'
    });
});
