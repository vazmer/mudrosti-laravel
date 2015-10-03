(function() {

    var Site = function(){

        var getLogo = function(){
            return 'media/logo.png';
        };

        var getCopyright = function() {
            return 'Mudrosti.org@2015, Sva prava zadržana';
        };

        return {
            getLogo: getLogo,
            getCopyright: getCopyright
        }
    };

    angular.module('app')
        .factory('Site', Site);
})();