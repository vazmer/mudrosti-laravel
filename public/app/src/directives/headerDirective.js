angular.module("app").directive("header", function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/header.html',
        controller: 'HeaderController'
    };
});