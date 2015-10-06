var apiPrefix = 'api/';

var app = angular.module('app', ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/:categorySlug/:quoteSlug', {
            controller: 'QuotesCollectionController',
            templateUrl: 'templates/quotes.html'
        })
        .otherwise({redirectTo:'/'});
});

app.config(['$httpProvider', function ($httpProvider) {
    // enable http caching by default
    $httpProvider.defaults.cache = true;
}]);

app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);
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
(function() {

    var PostDetailController = function ($scope, $location, $routeParams, post, mediaService) {

        function init() {
            setScope();
            getPost();
        };

        function setScope(){

            var media = {
                items: null,
                activeItem: null,
                prevItem: {counter:0},
                nextItem: {counter:0}
            }

            $scope.post = {
                media: media
            };

            $scope.isActiveMedia = function(media) {
                return getActiveMedia().ID === media.ID;
            };

            $scope.isActiveFirstMedia = function(){
                return getActiveMedia().ID === $scope.post.media.items[0].ID;
            };

            $scope.isActiveLastMedia = function(){
                return getActiveMedia().ID === $scope.post.media.items[$scope.post.media.items.length-1].ID;
            };

            $scope.goToPrevMedia = function(){
                goToMedia(getActiveMediaPosition()-1);
            };

            $scope.goToNextMedia = function(){
                goToMedia(getActiveMediaPosition()+1);
            };
        }

        //get quote
        var getPost = function () {
            var postLoaded = function(data){
                $scope.post = data;
                setupMedia();
            };

            var failure = function(data){
                console.log('Error: '+data);
            };

            post.single($routeParams.postSlug).then(postLoaded, failure);
        };

        //get media
        var setupMedia = function () {
            var activeMediaItem = {};
            var mediaItemsLength = $scope.post.media.items.length;

            if(mediaItemsLength ){
                activeMediaItem = $scope.post.media.items[0];

                if($routeParams.mediaSlug !== "undefined"){
                    for(var i=0; i<mediaItemsLength; i++){
                        var item = $scope.post.media.items[i];
                        if(item.slug === $routeParams.mediaSlug){
                            activeMediaItem = item;
                            break;
                        }
                    }
                }
            }
            setActiveMedia(activeMediaItem);
        };

        function setActiveMedia(item){
            $scope.post.media.activeItem = item;
            $location.path($scope.post.slug+'/'+getActiveMedia().slug, false);

            var activeMediaPosition = getActiveMediaPosition();

            setPrevMedia($scope.post.media.items[activeMediaPosition-1]);
            setNextMedia($scope.post.media.items[activeMediaPosition+1]);
        };

        function setPrevMedia(item){
            if(typeof item === "undefined") return;
            item.counter = getActiveMediaPosition();
            $scope.post.media.prevItem = item;
        };

        function setNextMedia(item){
            if(typeof item === "undefined") return;
            item.counter = getActiveMediaPosition()+2;
            $scope.post.media.nextItem = item;
        };

        function getActiveMediaPosition(){
            var items = $scope.post.media.items;
            var itemsLength = items.length;

            if(itemsLength){
                for(var i=0; i<itemsLength; i++){
                    if(getActiveMedia().ID == items[i].ID){
                        return i;
                    }
                }
            }
        }

        function getActiveMedia(){
            return $scope.post.media.activeItem;
        }

        function goToMedia(newMediaPosition){
            var newMedia = $scope.post.media.items[newMediaPosition];

            if($scope.post.media.items.length && typeof newMedia !== "undefined"){
                setActiveMedia(newMedia);
            }
        }

        init();
    };

    PostDetailController.$inject = ['$scope', '$location', '$routeParams', 'post', 'media'];

    app.controller('PostDetailController', PostDetailController);

})();
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
angular.module("app").directive("footer", function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/footer.html',
        controller: 'FooterController'
    };
});
angular.module("app").directive("footerNav", function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/navigation/footer-nav.html',
        controller: 'FooterController'
    };
});
angular.module("app").directive("header", function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/header.html',
        controller: 'HeaderController'
    };
});
angular.module("app").directive("headerNav", function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/navigation/header-nav.html',
        controller: 'HeaderController'
    };
});
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
(function(){

    var Quote = function($http, media){

        var getList = function(){
            return $http.get('quotes', {cache:true})
                        .then(function(response){
                            return response.data;
                        });
        };

        var getSingle = function(slug){
            var quote;
            var postMedia = { items:null };

            return $http.get(apiPrefix + 'quotes/'+slug)
                        .then(function(response) {
                            post = response.data[0];
                            console.log(post);
                            return media.list(post.ID);
                        }).then(function(data){
                            postMedia.items = data;
                            post.media = postMedia;
                            return post;
                        });
        };

        return {
            list: getList,
            single: getSingle
        }
    };

    angular.module('app')
        .factory('Quote', Quote);

})();
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
angular.module("app").filter('toTrusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIkZvb3RlckNvbnRyb2xsZXIuanMiLCJIZWFkZXJDb250cm9sbGVyLmpzIiwiUXVvdGVDb250cm9sbGVyLmpzIiwiUXVvdGVzQ29sbGVjdGlvbkNvbnRyb2xsZXIuanMiLCJmb290ZXJEaXJlY3RpdmUuanMiLCJmb290ZXJOYXZEaXJlY3RpdmUuanMiLCJoZWFkZXJEaXJlY3RpdmUuanMiLCJoZWFkZXJOYXZEaXJlY3RpdmUuanMiLCJDYXRlZ29yeVNlcnZpY2UuanMiLCJOYXZpZ2F0aW9uU2VydmljZS5qcyIsIlF1b3RlU2VydmljZS5qcyIsIlNpdGVTZXJ2aWNlLmpzIiwidG9UcnVzdGVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJuZy1hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBpUHJlZml4ID0gJ2FwaS8nO1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ25nUm91dGUnLCAnbmdBbmltYXRlJ10pO1xyXG5cclxuYXBwLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcclxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxuXHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvOmNhdGVnb3J5U2x1Zy86cXVvdGVTbHVnJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUXVvdGVzQ29sbGVjdGlvbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9xdW90ZXMuaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vdGhlcndpc2Uoe3JlZGlyZWN0VG86Jy8nfSk7XHJcbn0pO1xyXG5cclxuYXBwLmNvbmZpZyhbJyRodHRwUHJvdmlkZXInLCBmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xyXG4gICAgLy8gZW5hYmxlIGh0dHAgY2FjaGluZyBieSBkZWZhdWx0XHJcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmNhY2hlID0gdHJ1ZTtcclxufV0pO1xyXG5cclxuYXBwLnJ1bihbJyRyb3V0ZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsIGZ1bmN0aW9uICgkcm91dGUsICRyb290U2NvcGUsICRsb2NhdGlvbikge1xyXG4gICAgdmFyIG9yaWdpbmFsID0gJGxvY2F0aW9uLnBhdGg7XHJcbiAgICAkbG9jYXRpb24ucGF0aCA9IGZ1bmN0aW9uIChwYXRoLCByZWxvYWQpIHtcclxuICAgICAgICBpZiAocmVsb2FkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgbGFzdFJvdXRlID0gJHJvdXRlLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciB1biA9ICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHJvdXRlLmN1cnJlbnQgPSBsYXN0Um91dGU7XHJcbiAgICAgICAgICAgICAgICB1bigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsLmFwcGx5KCRsb2NhdGlvbiwgW3BhdGhdKTtcclxuICAgIH07XHJcbn1dKTsiLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIEZvb3RlckNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCBOYXZpZ2F0aW9uLCBTaXRlKSB7XHJcbiAgICAgICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuZm9vdGVyID0ge1xyXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiAnJyxcclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtczogW11cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNldENvcHlyaWdodCgpO1xyXG4gICAgICAgICAgICBzZXRGb290ZXJOYXYoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2V0Rm9vdGVyTmF2ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJHNjb3BlLmZvb3Rlci5tZW51SXRlbXMgPSBOYXZpZ2F0aW9uLmdldEZvb3Rlck1lbnUoKTtcclxuICAgICAgICAgICAgJHNjb3BlLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2V0Q29weXJpZ2h0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJHNjb3BlLmZvb3Rlci5jb3B5cmlnaHQgPSBTaXRlLmdldENvcHlyaWdodCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluaXQoKTtcclxuICAgIH07XHJcblxyXG4gICAgRm9vdGVyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnTmF2aWdhdGlvbicsICdTaXRlJ107XHJcblxyXG4gICAgYXBwLmNvbnRyb2xsZXIoJ0Zvb3RlckNvbnRyb2xsZXInLCBGb290ZXJDb250cm9sbGVyKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIEhlYWRlckNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCBOYXZpZ2F0aW9uLCBTaXRlKSB7XHJcbiAgICAgICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuaGVhZGVyID0ge1xyXG4gICAgICAgICAgICAgICAgbG9nbzogJycsXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbXM6IFtdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNldExvZ28oKTtcclxuICAgICAgICAgICAgc2V0SGVhZGVyTmF2KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHNldExvZ28gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkc2NvcGUuaGVhZGVyLmxvZ28gPSBTaXRlLmdldExvZ28oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2V0SGVhZGVyTmF2ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJHNjb3BlLmhlYWRlci5tZW51SXRlbXMgPSBOYXZpZ2F0aW9uLmdldEhlYWRlck1lbnUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpbml0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIEhlYWRlckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ05hdmlnYXRpb24nLCAnU2l0ZSddO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5jb250cm9sbGVyKCdIZWFkZXJDb250cm9sbGVyJywgSGVhZGVyQ29udHJvbGxlcik7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgUG9zdERldGFpbENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgcG9zdCwgbWVkaWFTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICAgIHNldFNjb3BlKCk7XHJcbiAgICAgICAgICAgIGdldFBvc3QoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXRTY29wZSgpe1xyXG5cclxuICAgICAgICAgICAgdmFyIG1lZGlhID0ge1xyXG4gICAgICAgICAgICAgICAgaXRlbXM6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBhY3RpdmVJdGVtOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgcHJldkl0ZW06IHtjb3VudGVyOjB9LFxyXG4gICAgICAgICAgICAgICAgbmV4dEl0ZW06IHtjb3VudGVyOjB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5wb3N0ID0ge1xyXG4gICAgICAgICAgICAgICAgbWVkaWE6IG1lZGlhXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuaXNBY3RpdmVNZWRpYSA9IGZ1bmN0aW9uKG1lZGlhKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QWN0aXZlTWVkaWEoKS5JRCA9PT0gbWVkaWEuSUQ7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuaXNBY3RpdmVGaXJzdE1lZGlhID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRBY3RpdmVNZWRpYSgpLklEID09PSAkc2NvcGUucG9zdC5tZWRpYS5pdGVtc1swXS5JRDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5pc0FjdGl2ZUxhc3RNZWRpYSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QWN0aXZlTWVkaWEoKS5JRCA9PT0gJHNjb3BlLnBvc3QubWVkaWEuaXRlbXNbJHNjb3BlLnBvc3QubWVkaWEuaXRlbXMubGVuZ3RoLTFdLklEO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdvVG9QcmV2TWVkaWEgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgZ29Ub01lZGlhKGdldEFjdGl2ZU1lZGlhUG9zaXRpb24oKS0xKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nb1RvTmV4dE1lZGlhID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGdvVG9NZWRpYShnZXRBY3RpdmVNZWRpYVBvc2l0aW9uKCkrMSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2dldCBxdW90ZVxyXG4gICAgICAgIHZhciBnZXRQb3N0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zdExvYWRlZCA9IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvc3QgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgc2V0dXBNZWRpYSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGZhaWx1cmUgPSBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJytkYXRhKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHBvc3Quc2luZ2xlKCRyb3V0ZVBhcmFtcy5wb3N0U2x1ZykudGhlbihwb3N0TG9hZGVkLCBmYWlsdXJlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL2dldCBtZWRpYVxyXG4gICAgICAgIHZhciBzZXR1cE1lZGlhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYWN0aXZlTWVkaWFJdGVtID0ge307XHJcbiAgICAgICAgICAgIHZhciBtZWRpYUl0ZW1zTGVuZ3RoID0gJHNjb3BlLnBvc3QubWVkaWEuaXRlbXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgaWYobWVkaWFJdGVtc0xlbmd0aCApe1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlTWVkaWFJdGVtID0gJHNjb3BlLnBvc3QubWVkaWEuaXRlbXNbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHJvdXRlUGFyYW1zLm1lZGlhU2x1ZyAhPT0gXCJ1bmRlZmluZWRcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8bWVkaWFJdGVtc0xlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkc2NvcGUucG9zdC5tZWRpYS5pdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXRlbS5zbHVnID09PSAkcm91dGVQYXJhbXMubWVkaWFTbHVnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZU1lZGlhSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRBY3RpdmVNZWRpYShhY3RpdmVNZWRpYUl0ZW0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldEFjdGl2ZU1lZGlhKGl0ZW0pe1xyXG4gICAgICAgICAgICAkc2NvcGUucG9zdC5tZWRpYS5hY3RpdmVJdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJHNjb3BlLnBvc3Quc2x1ZysnLycrZ2V0QWN0aXZlTWVkaWEoKS5zbHVnLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWN0aXZlTWVkaWFQb3NpdGlvbiA9IGdldEFjdGl2ZU1lZGlhUG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHNldFByZXZNZWRpYSgkc2NvcGUucG9zdC5tZWRpYS5pdGVtc1thY3RpdmVNZWRpYVBvc2l0aW9uLTFdKTtcclxuICAgICAgICAgICAgc2V0TmV4dE1lZGlhKCRzY29wZS5wb3N0Lm1lZGlhLml0ZW1zW2FjdGl2ZU1lZGlhUG9zaXRpb24rMV0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldFByZXZNZWRpYShpdGVtKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybjtcclxuICAgICAgICAgICAgaXRlbS5jb3VudGVyID0gZ2V0QWN0aXZlTWVkaWFQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAkc2NvcGUucG9zdC5tZWRpYS5wcmV2SXRlbSA9IGl0ZW07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0TmV4dE1lZGlhKGl0ZW0pe1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgaXRlbSA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xyXG4gICAgICAgICAgICBpdGVtLmNvdW50ZXIgPSBnZXRBY3RpdmVNZWRpYVBvc2l0aW9uKCkrMjtcclxuICAgICAgICAgICAgJHNjb3BlLnBvc3QubWVkaWEubmV4dEl0ZW0gPSBpdGVtO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEFjdGl2ZU1lZGlhUG9zaXRpb24oKXtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gJHNjb3BlLnBvc3QubWVkaWEuaXRlbXM7XHJcbiAgICAgICAgICAgIHZhciBpdGVtc0xlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmKGl0ZW1zTGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGl0ZW1zTGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGdldEFjdGl2ZU1lZGlhKCkuSUQgPT0gaXRlbXNbaV0uSUQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEFjdGl2ZU1lZGlhKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUucG9zdC5tZWRpYS5hY3RpdmVJdGVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ29Ub01lZGlhKG5ld01lZGlhUG9zaXRpb24pe1xyXG4gICAgICAgICAgICB2YXIgbmV3TWVkaWEgPSAkc2NvcGUucG9zdC5tZWRpYS5pdGVtc1tuZXdNZWRpYVBvc2l0aW9uXTtcclxuXHJcbiAgICAgICAgICAgIGlmKCRzY29wZS5wb3N0Lm1lZGlhLml0ZW1zLmxlbmd0aCAmJiB0eXBlb2YgbmV3TWVkaWEgIT09IFwidW5kZWZpbmVkXCIpe1xyXG4gICAgICAgICAgICAgICAgc2V0QWN0aXZlTWVkaWEobmV3TWVkaWEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIFBvc3REZXRhaWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJHJvdXRlUGFyYW1zJywgJ3Bvc3QnLCAnbWVkaWEnXTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcignUG9zdERldGFpbENvbnRyb2xsZXInLCBQb3N0RGV0YWlsQ29udHJvbGxlcik7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgUXVvdGVzQ29sbGVjdGlvbkNvbnRyb2xsZXI7XHJcblxyXG4gICAgUXVvdGVzQ29sbGVjdGlvbkNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgQ2F0ZWdvcnkpIHtcclxuICAgICAgICB2YXIgYWN0aXZlUXVvdGU7XHJcblxyXG4gICAgICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpbml0U2NvcGUoKTtcclxuICAgICAgICAgICAgZ2V0Q2F0ZWdvcnlRdW90ZXMoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgaW5pdFNjb3BlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBzY29wZSdzIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgJHNjb3BlLmNhdGVnb3J5ID0gW107XHJcbiAgICAgICAgICAgICRzY29wZS5xdW90ZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNjb3BlJ3MgbWV0aG9kc1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNBY3RpdmUgPSBpc0FjdGl2ZTtcclxuICAgICAgICAgICAgJHNjb3BlLmlzQWN0aXZlRmlyc3RRdW90ZSA9IGlzQWN0aXZlRmlyc3RRdW90ZTtcclxuICAgICAgICAgICAgJHNjb3BlLmlzQWN0aXZlTGFzdFF1b3RlID0gaXNBY3RpdmVMYXN0UXVvdGU7XHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcmV2UXVvdGUgPSBnZXRQcmV2UXVvdGU7XHJcbiAgICAgICAgICAgICRzY29wZS5nZXROZXh0UXVvdGUgPSBnZXROZXh0UXVvdGU7XHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcmV2UXVvdGVDb3VudGVyID0gZ2V0UHJldlF1b3RlQ291bnRlcjtcclxuICAgICAgICAgICAgJHNjb3BlLmdldE5leHRRdW90ZUNvdW50ZXIgPSBnZXROZXh0UXVvdGVDb3VudGVyO1xyXG4gICAgICAgICAgICAkc2NvcGUuZ29Ub1F1b3RlID0gZ29Ub1F1b3RlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnZXRDYXRlZ29yeVF1b3RlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBmdW5jdGlvbihyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucXVvdGVzID0gcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgc2V0QWN0aXZlUXVvdGUoJHJvdXRlUGFyYW1zLnF1b3RlU2x1Zyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhdGVnb3J5LnF1b3Rlcygkcm91dGVQYXJhbXMuY2F0ZWdvcnlTbHVnKS50aGVuKHN1Y2Nlc3MpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBpc0FjdGl2ZSA9IGZ1bmN0aW9uKHF1b3RlKSB7XHJcbiAgICAgICAgICAgIGlmKCRzY29wZS5xdW90ZXMubGVuZ3RoID09PSAwIHx8IHR5cGVvZiBxdW90ZSA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVvdGUuc2x1ZyA9PT0gYWN0aXZlUXVvdGUuc2x1ZztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2V0QWN0aXZlUXVvdGUgPSBmdW5jdGlvbihxdW90ZVNsdWcpIHtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5xdW90ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5xdW90ZXNbaV0uc2x1ZyA9PT0gcXVvdGVTbHVnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlUXVvdGUgPSAkc2NvcGUucXVvdGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGlzQWN0aXZlRmlyc3RRdW90ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLnF1b3Rlcy5sZW5ndGggJiYgZ2V0QWN0aXZlUXVvdGVJbmRleCgpID09PSAwO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBpc0FjdGl2ZUxhc3RRdW90ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLnF1b3Rlcy5sZW5ndGggJiYgZ2V0QWN0aXZlUXVvdGVJbmRleCgpID09PSAkc2NvcGUucXVvdGVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGdldFByZXZRdW90ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcHJldlF1b3RlID0gbnVsbDtcclxuICAgICAgICAgICAgaWYoYWN0aXZlUXVvdGUgJiYgJHNjb3BlLnF1b3Rlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhY3RpdmVRdW90ZUluZGV4ID0gZ2V0QWN0aXZlUXVvdGVJbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mICRzY29wZS5xdW90ZXNbYWN0aXZlUXVvdGVJbmRleC0xXSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZRdW90ZSA9ICRzY29wZS5xdW90ZXNbYWN0aXZlUXVvdGVJbmRleC0xXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJldlF1b3RlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnZXROZXh0UXVvdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5leHRRdW90ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmKGFjdGl2ZVF1b3RlICYmICRzY29wZS5xdW90ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlUXVvdGVJbmRleCA9IGdldEFjdGl2ZVF1b3RlSW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiAkc2NvcGUucXVvdGVzW2FjdGl2ZVF1b3RlSW5kZXgrMV0gIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0UXVvdGUgPSAkc2NvcGUucXVvdGVzW2FjdGl2ZVF1b3RlSW5kZXgrMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5leHRRdW90ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZ2V0QWN0aXZlUXVvdGVJbmRleCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLnF1b3Rlcy5pbmRleE9mKGFjdGl2ZVF1b3RlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZ2V0QWN0aXZlUXVvdGVDb3VudGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRBY3RpdmVRdW90ZUluZGV4KCkgKyAxO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnZXRQcmV2UXVvdGVDb3VudGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBhY3RpdmVDb3VudGVyID0gZ2V0QWN0aXZlUXVvdGVDb3VudGVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhY3RpdmVDb3VudGVyIDw9IDEgPyAxIDogYWN0aXZlQ291bnRlciAtIDE7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGdldE5leHRRdW90ZUNvdW50ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFjdGl2ZUNvdW50ZXIgPSBnZXRBY3RpdmVRdW90ZUNvdW50ZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZUNvdW50ZXIgPT09ICRzY29wZS5xdW90ZXMubGVuZ3RoID8gYWN0aXZlQ291bnRlciA6IGFjdGl2ZUNvdW50ZXIgKyAxO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnb1RvUXVvdGUgPSBmdW5jdGlvbihxdW90ZSkge1xyXG4gICAgICAgICAgICBzZXRBY3RpdmVRdW90ZShxdW90ZS5zbHVnKTtcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ldHdlLycgKyBxdW90ZS5zbHVnLCBmYWxzZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5pdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBRdW90ZXNDb2xsZWN0aW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJyRsb2NhdGlvbicsICdDYXRlZ29yeSddO1xyXG5cclxuICAgIGFwcC5jb250cm9sbGVyKCdRdW90ZXNDb2xsZWN0aW9uQ29udHJvbGxlcicsIFF1b3Rlc0NvbGxlY3Rpb25Db250cm9sbGVyKTtcclxuXHJcbn0pKCk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHBcIikuZGlyZWN0aXZlKFwiZm9vdGVyXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2Zvb3Rlci5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiAnRm9vdGVyQ29udHJvbGxlcidcclxuICAgIH07XHJcbn0pOyIsImFuZ3VsYXIubW9kdWxlKFwiYXBwXCIpLmRpcmVjdGl2ZShcImZvb3Rlck5hdlwiLCBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9uYXZpZ2F0aW9uL2Zvb3Rlci1uYXYuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0Zvb3RlckNvbnRyb2xsZXInXHJcbiAgICB9O1xyXG59KTsiLCJhbmd1bGFyLm1vZHVsZShcImFwcFwiKS5kaXJlY3RpdmUoXCJoZWFkZXJcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaGVhZGVyLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIZWFkZXJDb250cm9sbGVyJ1xyXG4gICAgfTtcclxufSk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHBcIikuZGlyZWN0aXZlKFwiaGVhZGVyTmF2XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL25hdmlnYXRpb24vaGVhZGVyLW5hdi5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiAnSGVhZGVyQ29udHJvbGxlcidcclxuICAgIH07XHJcbn0pOyIsIihmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBDYXRlZ29yeSA9IGZ1bmN0aW9uKCRodHRwKXtcclxuICAgICAgICB2YXIgQXBpU291cmNlID0gYXBpUHJlZml4ICsgJ2NhdGVnb3JpZXMnO1xyXG5cclxuICAgICAgICB2YXIgc3VjY2VzcyA9IGZ1bmN0aW9uIChyZXNwb25zZSkgeyByZXR1cm4gcmVzcG9uc2UuZGF0YTsgfSxcclxuICAgICAgICAgICAgZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHsgcmV0dXJuIGVycm9yLmRhdGE7IH07XHJcblxyXG4gICAgICAgIHZhciBnZXRBbGwgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KEFwaVNvdXJjZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZ2V0U2luZ2xlID0gZnVuY3Rpb24oc2x1Zyl7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoQXBpU291cmNlICsgJy8nICsgc2x1ZylcclxuICAgICAgICAgICAgICAgIC50aGVuKHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZ2V0UXVvdGVzID0gZnVuY3Rpb24oc2x1Zyl7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoQXBpU291cmNlICsgJy8nICsgc2x1ZyArICcvcXVvdGVzJylcclxuICAgICAgICAgICAgICAgIC50aGVuKHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhbGw6IGdldEFsbCxcclxuICAgICAgICAgICAgc2luZ2xlOiBnZXRTaW5nbGUsXHJcbiAgICAgICAgICAgIHF1b3RlczogZ2V0UXVvdGVzXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZmFjdG9yeSgnQ2F0ZWdvcnknLCBDYXRlZ29yeSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIE5hdmlnYXRpb24gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBtZW51TW9ja2VkID0gW1xyXG4gICAgICAgICAgICB7IHVybDogJyMnLCB0aXRsZTogJ1ByYXZpbGEga29yacWhxIdlbmphJyB9LFxyXG4gICAgICAgICAgICB7IHVybDogJyMnLCB0aXRsZTogJ1BvbGlzYSBwcml2YXRub3N0aScgfSxcclxuICAgICAgICAgICAgeyB1cmw6ICcjJywgdGl0bGU6ICdLb250YWt0JyB9LFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHZhciBnZXRIZWFkZXJNZW51ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIG1lbnVNb2NrZWQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGdldEZvb3Rlck1lbnUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gbWVudU1vY2tlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRIZWFkZXJNZW51OiBnZXRIZWFkZXJNZW51LFxyXG4gICAgICAgICAgICBnZXRGb290ZXJNZW51OiBnZXRGb290ZXJNZW51XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZmFjdG9yeSgnTmF2aWdhdGlvbicsIE5hdmlnYXRpb24pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG5cclxuICAgIHZhciBRdW90ZSA9IGZ1bmN0aW9uKCRodHRwLCBtZWRpYSl7XHJcblxyXG4gICAgICAgIHZhciBnZXRMaXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgncXVvdGVzJywge2NhY2hlOnRydWV9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGdldFNpbmdsZSA9IGZ1bmN0aW9uKHNsdWcpe1xyXG4gICAgICAgICAgICB2YXIgcXVvdGU7XHJcbiAgICAgICAgICAgIHZhciBwb3N0TWVkaWEgPSB7IGl0ZW1zOm51bGwgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYXBpUHJlZml4ICsgJ3F1b3Rlcy8nK3NsdWcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0ID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lZGlhLmxpc3QocG9zdC5JRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0TWVkaWEuaXRlbXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdC5tZWRpYSA9IHBvc3RNZWRpYTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwb3N0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsaXN0OiBnZXRMaXN0LFxyXG4gICAgICAgICAgICBzaW5nbGU6IGdldFNpbmdsZVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmZhY3RvcnkoJ1F1b3RlJywgUXVvdGUpO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIFNpdGUgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB2YXIgZ2V0TG9nbyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAnbWVkaWEvbG9nby5wbmcnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnZXRDb3B5cmlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdNdWRyb3N0aS5vcmdAMjAxNSwgU3ZhIHByYXZhIHphZHLFvmFuYSc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2V0TG9nbzogZ2V0TG9nbyxcclxuICAgICAgICAgICAgZ2V0Q29weXJpZ2h0OiBnZXRDb3B5cmlnaHRcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdTaXRlJywgU2l0ZSk7XHJcbn0pKCk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHBcIikuZmlsdGVyKCd0b1RydXN0ZWQnLCBbJyRzY2UnLCBmdW5jdGlvbigkc2NlKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xyXG4gICAgfTtcclxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
