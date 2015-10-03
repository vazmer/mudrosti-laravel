angular.module("app").directive("footer", function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/footer.html',
        controller: 'FooterController'
    };
});