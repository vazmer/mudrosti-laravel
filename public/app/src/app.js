var apiPrefix = 'api/';

var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/:categorySlug', {
            controller: 'QuotesCollectionController',
            templateUrl: 'templates/quotes.html'
        })
        .otherwise({redirectTo:'/'});
});

app.config(['$httpProvider', function ($httpProvider) {
    // enable http caching by default
    $httpProvider.defaults.cache = true;
}])

app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);


