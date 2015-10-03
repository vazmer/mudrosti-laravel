(function(){

    var Navigation = function(){
        var menuMocked = [
            { url: '#', title: 'Pravila korišćenja' },
            { url: '#', title: 'Polisa privatnosti' },
            { url: '#', title: 'Kontakt' },
        ];

        var getHeaderMenu = function(){
            return menuMocked;
        };

        var getFooterMenu = function(){
            return menuMocked;
        };

        return {
            getHeaderMenu: getHeaderMenu,
            getFooterMenu: getFooterMenu
        }
    };

    angular.module('app')
        .factory('Navigation', Navigation);
})();