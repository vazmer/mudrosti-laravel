(function() {

    var HeaderController = function ($scope, Navigation, Site) {
        var init = function () {
            $scope.isLoaded = false;
            $scope.header = {
                logo: '',
                menuItems: []
            };
            setLogo();
            setHeaderNav();
        };

        var setLogo = function(){
            $scope.header.logo = Site.getLogo();
        };

        var setHeaderNav = function(){
            $scope.header.menuItems = Navigation.getHeaderMenu();
        };

        init();
    };

    HeaderController.$inject = ['$scope', 'Navigation', 'Site'];

    angular.module('app').controller('HeaderController', HeaderController);

})();