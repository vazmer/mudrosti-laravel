(function() {

    var QuotesCollectionController;

    QuotesCollectionController = function ($scope, $routeParams, Category) {
        var init = function () {
            initScope();
            getCategoryQuotes();
        };

        var initScope = function () {
            $scope.category = [];
            $scope.quotes = [];
        };

        var getCategoryQuotes = function () {
            var success = function(data) {
                $scope.quotes = data;
            };
            Category.quotes($routeParams.categorySlug, success);
        };
        init();
    };

    QuotesCollectionController.$inject = ['$scope', '$routeParams', 'Category'];

    app.controller('QuotesCollectionController', QuotesCollectionController);

})();