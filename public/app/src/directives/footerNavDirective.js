angular.module("app").directive("footerNav", function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/navigation/footer-nav.html',
        controller: 'FooterController'
    };
});