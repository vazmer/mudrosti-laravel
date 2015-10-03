angular.module("app").directive("headerNav", function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/navigation/header-nav.html',
        controller: 'HeaderController'
    };
});