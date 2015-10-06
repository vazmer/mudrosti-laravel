(function() {

    var QuotesCollectionController;

    QuotesCollectionController = function ($scope, $routeParams, $location, Category) {
        var activeQuote;

        var init = function () {
            initScope();
            getCategoryQuotes();
        };

        var initScope = function () {
            // scope's properties
            $scope.category = [];
            $scope.quotes = [];

            // scope's methods
            $scope.isActive = isActive;
            $scope.isActiveFirstQuote = isActiveFirstQuote;
            $scope.isActiveLastQuote = isActiveLastQuote;
            $scope.getPrevQuote = getPrevQuote;
            $scope.getNextQuote = getNextQuote;
            $scope.getPrevQuoteCounter = getPrevQuoteCounter;
            $scope.getNextQuoteCounter = getNextQuoteCounter;
            $scope.goToQuote = goToQuote;
        };

        var getCategoryQuotes = function () {
            var success = function(resp) {
                $scope.quotes = resp.data;
                setActiveQuote($routeParams.quoteSlug);
            };
            Category.quotes($routeParams.categorySlug).then(success);
        };

        var isActive = function(quote) {
            if($scope.quotes.length === 0 || typeof quote === "undefined") return false;
            return quote.slug === activeQuote.slug;
        };

        var setActiveQuote = function(quoteSlug) {
            for(var i = 0; i < $scope.quotes.length; i++) {
                if($scope.quotes[i].slug === quoteSlug) {
                    activeQuote = $scope.quotes[i];
                    break;
                }
            }
        };

        var isActiveFirstQuote = function() {
            return $scope.quotes.length && getActiveQuoteIndex() === 0;
        };

        var isActiveLastQuote = function() {
            return $scope.quotes.length && getActiveQuoteIndex() === $scope.quotes.length - 1;
        };

        var getPrevQuote = function() {
            var prevQuote = null;
            if(activeQuote && $scope.quotes.length) {
                var activeQuoteIndex = getActiveQuoteIndex();
                if(typeof $scope.quotes[activeQuoteIndex-1] !== "undefined") {
                    prevQuote = $scope.quotes[activeQuoteIndex-1];
                }
            }
            return prevQuote;
        };

        var getNextQuote = function() {
            var nextQuote = null;
            if(activeQuote && $scope.quotes.length) {
                var activeQuoteIndex = getActiveQuoteIndex();
                if(typeof $scope.quotes[activeQuoteIndex+1] !== "undefined") {
                    nextQuote = $scope.quotes[activeQuoteIndex+1];
                }
            }
            return nextQuote;
        };

        var getActiveQuoteIndex = function() {
            return $scope.quotes.indexOf(activeQuote);
        };

        var getActiveQuoteCounter = function() {
            return getActiveQuoteIndex() + 1;
        };

        var getPrevQuoteCounter = function() {
            var activeCounter = getActiveQuoteCounter();
            return activeCounter <= 1 ? 1 : activeCounter - 1;
        };

        var getNextQuoteCounter = function() {
            var activeCounter = getActiveQuoteCounter();
            return activeCounter === $scope.quotes.length ? activeCounter : activeCounter + 1;
        };

        var goToQuote = function(quote) {
            setActiveQuote(quote.slug);
            $location.path('/etwe/' + quote.slug, false);
        };

        init();
    };

    QuotesCollectionController.$inject = ['$scope', '$routeParams', '$location', 'Category'];

    app.controller('QuotesCollectionController', QuotesCollectionController);

})();