(function(){

    var Category = function($http){
        var ApiSource = apiPrefix + 'categories';

        var success = function (response) { return response.data; },
            error = function (error) { return error.data; };

        var getAll = function(){
            return $http.get(ApiSource)
                .then(success, error);
        };

        var getSingle = function(slug){
            return $http.get(ApiSource + '/' + slug)
                .then(success, error);
        };

        var getQuotes = function(slug){
            return $http.get(ApiSource + '/' + slug + '/quotes')
                .then(success, error);
        };

        return {
            all: getAll,
            single: getSingle,
            quotes: getQuotes
        }
    };

    angular.module('app')
        .factory('Category', Category);
})();