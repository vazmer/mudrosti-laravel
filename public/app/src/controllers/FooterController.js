(function() {

    var FooterController = function ($scope, Navigation, Site) {
        var init = function () {
            $scope.isLoaded = false;
            $scope.footer = {
                copyright: '',
                menuItems: []
            };

            setCopyright();
            setFooterNav();
        };

        var setFooterNav = function(){
            $scope.footer.menuItems = Navigation.getFooterMenu();
            $scope.isLoaded = true;
        };

        var setCopyright = function(){
            $scope.footer.copyright = Site.getCopyright();
        };

        init();
    };

    FooterController.$inject = ['$scope', 'Navigation', 'Site'];

    app.controller('FooterController', FooterController);
})();