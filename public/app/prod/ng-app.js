var apiPrefix = 'api/';

var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/:categorySlug', {
            controller: 'QuotesCollectionController',
            templateUrl: 'templates/quotes.html'
        })
        .otherwise({redirectTo:'/'});
});

app.config(['$httpProvider', function ($httpProvider) {
    // enable http caching by default
    $httpProvider.defaults.cache = true;
}])

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

        //get post
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIkNhdGVnb3J5Q29udHJvbGxlci5qcyIsIkZvb3RlckNvbnRyb2xsZXIuanMiLCJIZWFkZXJDb250cm9sbGVyLmpzIiwiUXVvdGVDb250cm9sbGVyLmpzIiwiZm9vdGVyRGlyZWN0aXZlLmpzIiwiZm9vdGVyTmF2RGlyZWN0aXZlLmpzIiwiaGVhZGVyRGlyZWN0aXZlLmpzIiwiaGVhZGVyTmF2RGlyZWN0aXZlLmpzIiwiQ2F0ZWdvcnlTZXJ2aWNlLmpzIiwiTmF2aWdhdGlvblNlcnZpY2UuanMiLCJRdW90ZVNlcnZpY2UuanMiLCJTaXRlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJuZy1hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBpUHJlZml4ID0gJ2FwaS8nO1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ25nUm91dGUnXSk7XHJcblxyXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG5cclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy86Y2F0ZWdvcnlTbHVnJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUXVvdGVzQ29sbGVjdGlvbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9xdW90ZXMuaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vdGhlcndpc2Uoe3JlZGlyZWN0VG86Jy8nfSk7XHJcbn0pO1xyXG5cclxuYXBwLmNvbmZpZyhbJyRodHRwUHJvdmlkZXInLCBmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xyXG4gICAgLy8gZW5hYmxlIGh0dHAgY2FjaGluZyBieSBkZWZhdWx0XHJcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmNhY2hlID0gdHJ1ZTtcclxufV0pXHJcblxyXG5hcHAucnVuKFsnJHJvdXRlJywgJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJywgZnVuY3Rpb24gKCRyb3V0ZSwgJHJvb3RTY29wZSwgJGxvY2F0aW9uKSB7XHJcbiAgICB2YXIgb3JpZ2luYWwgPSAkbG9jYXRpb24ucGF0aDtcclxuICAgICRsb2NhdGlvbi5wYXRoID0gZnVuY3Rpb24gKHBhdGgsIHJlbG9hZCkge1xyXG4gICAgICAgIGlmIChyZWxvYWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHZhciBsYXN0Um91dGUgPSAkcm91dGUuY3VycmVudDtcclxuICAgICAgICAgICAgdmFyIHVuID0gJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkcm91dGUuY3VycmVudCA9IGxhc3RSb3V0ZTtcclxuICAgICAgICAgICAgICAgIHVuKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3JpZ2luYWwuYXBwbHkoJGxvY2F0aW9uLCBbcGF0aF0pO1xyXG4gICAgfTtcclxufV0pO1xyXG5cclxuXHJcbiIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgUXVvdGVzQ29sbGVjdGlvbkNvbnRyb2xsZXI7XHJcblxyXG4gICAgUXVvdGVzQ29sbGVjdGlvbkNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsIENhdGVnb3J5KSB7XHJcbiAgICAgICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGluaXRTY29wZSgpO1xyXG4gICAgICAgICAgICBnZXRDYXRlZ29yeVF1b3RlcygpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBpbml0U2NvcGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXRlZ29yeSA9IFtdO1xyXG4gICAgICAgICAgICAkc2NvcGUucXVvdGVzID0gW107XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGdldENhdGVnb3J5UXVvdGVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5xdW90ZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDYXRlZ29yeS5xdW90ZXMoJHJvdXRlUGFyYW1zLmNhdGVnb3J5U2x1Zywgc3VjY2Vzcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbml0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIFF1b3Rlc0NvbGxlY3Rpb25Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnQ2F0ZWdvcnknXTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcignUXVvdGVzQ29sbGVjdGlvbkNvbnRyb2xsZXInLCBRdW90ZXNDb2xsZWN0aW9uQ29udHJvbGxlcik7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgRm9vdGVyQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsIE5hdmlnYXRpb24sIFNpdGUpIHtcclxuICAgICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS5mb290ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW1zOiBbXVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgc2V0Q29weXJpZ2h0KCk7XHJcbiAgICAgICAgICAgIHNldEZvb3Rlck5hdigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBzZXRGb290ZXJOYXYgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkc2NvcGUuZm9vdGVyLm1lbnVJdGVtcyA9IE5hdmlnYXRpb24uZ2V0Rm9vdGVyTWVudSgpO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBzZXRDb3B5cmlnaHQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkc2NvcGUuZm9vdGVyLmNvcHlyaWdodCA9IFNpdGUuZ2V0Q29weXJpZ2h0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5pdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBGb290ZXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdOYXZpZ2F0aW9uJywgJ1NpdGUnXTtcclxuXHJcbiAgICBhcHAuY29udHJvbGxlcignRm9vdGVyQ29udHJvbGxlcicsIEZvb3RlckNvbnRyb2xsZXIpO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgSGVhZGVyQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsIE5hdmlnYXRpb24sIFNpdGUpIHtcclxuICAgICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS5oZWFkZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBsb2dvOiAnJyxcclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtczogW11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2V0TG9nbygpO1xyXG4gICAgICAgICAgICBzZXRIZWFkZXJOYXYoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2V0TG9nbyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICRzY29wZS5oZWFkZXIubG9nbyA9IFNpdGUuZ2V0TG9nbygpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBzZXRIZWFkZXJOYXYgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkc2NvcGUuaGVhZGVyLm1lbnVJdGVtcyA9IE5hdmlnYXRpb24uZ2V0SGVhZGVyTWVudSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluaXQoKTtcclxuICAgIH07XHJcblxyXG4gICAgSGVhZGVyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnTmF2aWdhdGlvbicsICdTaXRlJ107XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBIZWFkZXJDb250cm9sbGVyKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBQb3N0RGV0YWlsQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBwb3N0LCBtZWRpYVNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgc2V0U2NvcGUoKTtcclxuICAgICAgICAgICAgZ2V0UG9zdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldFNjb3BlKCl7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWVkaWEgPSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtczogbnVsbCxcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUl0ZW06IG51bGwsXHJcbiAgICAgICAgICAgICAgICBwcmV2SXRlbToge2NvdW50ZXI6MH0sXHJcbiAgICAgICAgICAgICAgICBuZXh0SXRlbToge2NvdW50ZXI6MH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnBvc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZWRpYTogbWVkaWFcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5pc0FjdGl2ZU1lZGlhID0gZnVuY3Rpb24obWVkaWEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRBY3RpdmVNZWRpYSgpLklEID09PSBtZWRpYS5JRDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5pc0FjdGl2ZUZpcnN0TWVkaWEgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEFjdGl2ZU1lZGlhKCkuSUQgPT09ICRzY29wZS5wb3N0Lm1lZGlhLml0ZW1zWzBdLklEO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmlzQWN0aXZlTGFzdE1lZGlhID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRBY3RpdmVNZWRpYSgpLklEID09PSAkc2NvcGUucG9zdC5tZWRpYS5pdGVtc1skc2NvcGUucG9zdC5tZWRpYS5pdGVtcy5sZW5ndGgtMV0uSUQ7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZ29Ub1ByZXZNZWRpYSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBnb1RvTWVkaWEoZ2V0QWN0aXZlTWVkaWFQb3NpdGlvbigpLTEpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdvVG9OZXh0TWVkaWEgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgZ29Ub01lZGlhKGdldEFjdGl2ZU1lZGlhUG9zaXRpb24oKSsxKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vZ2V0IHBvc3RcclxuICAgICAgICB2YXIgZ2V0UG9zdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHBvc3RMb2FkZWQgPSBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5wb3N0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHNldHVwTWVkaWEoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmYWlsdXJlID0gZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcrZGF0YSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBwb3N0LnNpbmdsZSgkcm91dGVQYXJhbXMucG9zdFNsdWcpLnRoZW4ocG9zdExvYWRlZCwgZmFpbHVyZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9nZXQgbWVkaWFcclxuICAgICAgICB2YXIgc2V0dXBNZWRpYSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFjdGl2ZU1lZGlhSXRlbSA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgbWVkaWFJdGVtc0xlbmd0aCA9ICRzY29wZS5wb3N0Lm1lZGlhLml0ZW1zLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmKG1lZGlhSXRlbXNMZW5ndGggKXtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZU1lZGlhSXRlbSA9ICRzY29wZS5wb3N0Lm1lZGlhLml0ZW1zWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRyb3V0ZVBhcmFtcy5tZWRpYVNsdWcgIT09IFwidW5kZWZpbmVkXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPG1lZGlhSXRlbXNMZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gJHNjb3BlLnBvc3QubWVkaWEuaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0uc2x1ZyA9PT0gJHJvdXRlUGFyYW1zLm1lZGlhU2x1Zyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVNZWRpYUl0ZW0gPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0QWN0aXZlTWVkaWEoYWN0aXZlTWVkaWFJdGVtKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXRBY3RpdmVNZWRpYShpdGVtKXtcclxuICAgICAgICAgICAgJHNjb3BlLnBvc3QubWVkaWEuYWN0aXZlSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCRzY29wZS5wb3N0LnNsdWcrJy8nK2dldEFjdGl2ZU1lZGlhKCkuc2x1ZywgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFjdGl2ZU1lZGlhUG9zaXRpb24gPSBnZXRBY3RpdmVNZWRpYVBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBzZXRQcmV2TWVkaWEoJHNjb3BlLnBvc3QubWVkaWEuaXRlbXNbYWN0aXZlTWVkaWFQb3NpdGlvbi0xXSk7XHJcbiAgICAgICAgICAgIHNldE5leHRNZWRpYSgkc2NvcGUucG9zdC5tZWRpYS5pdGVtc1thY3RpdmVNZWRpYVBvc2l0aW9uKzFdKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXRQcmV2TWVkaWEoaXRlbSl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBpdGVtID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XHJcbiAgICAgICAgICAgIGl0ZW0uY291bnRlciA9IGdldEFjdGl2ZU1lZGlhUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgJHNjb3BlLnBvc3QubWVkaWEucHJldkl0ZW0gPSBpdGVtO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldE5leHRNZWRpYShpdGVtKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybjtcclxuICAgICAgICAgICAgaXRlbS5jb3VudGVyID0gZ2V0QWN0aXZlTWVkaWFQb3NpdGlvbigpKzI7XHJcbiAgICAgICAgICAgICRzY29wZS5wb3N0Lm1lZGlhLm5leHRJdGVtID0gaXRlbTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRBY3RpdmVNZWRpYVBvc2l0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9ICRzY29wZS5wb3N0Lm1lZGlhLml0ZW1zO1xyXG4gICAgICAgICAgICB2YXIgaXRlbXNMZW5ndGggPSBpdGVtcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBpZihpdGVtc0xlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxpdGVtc0xlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihnZXRBY3RpdmVNZWRpYSgpLklEID09IGl0ZW1zW2ldLklEKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRBY3RpdmVNZWRpYSgpe1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLnBvc3QubWVkaWEuYWN0aXZlSXRlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdvVG9NZWRpYShuZXdNZWRpYVBvc2l0aW9uKXtcclxuICAgICAgICAgICAgdmFyIG5ld01lZGlhID0gJHNjb3BlLnBvc3QubWVkaWEuaXRlbXNbbmV3TWVkaWFQb3NpdGlvbl07XHJcblxyXG4gICAgICAgICAgICBpZigkc2NvcGUucG9zdC5tZWRpYS5pdGVtcy5sZW5ndGggJiYgdHlwZW9mIG5ld01lZGlhICE9PSBcInVuZGVmaW5lZFwiKXtcclxuICAgICAgICAgICAgICAgIHNldEFjdGl2ZU1lZGlhKG5ld01lZGlhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBQb3N0RGV0YWlsQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJyRyb3V0ZVBhcmFtcycsICdwb3N0JywgJ21lZGlhJ107XHJcblxyXG4gICAgYXBwLmNvbnRyb2xsZXIoJ1Bvc3REZXRhaWxDb250cm9sbGVyJywgUG9zdERldGFpbENvbnRyb2xsZXIpO1xyXG5cclxufSkoKTsiLCJhbmd1bGFyLm1vZHVsZShcImFwcFwiKS5kaXJlY3RpdmUoXCJmb290ZXJcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZm9vdGVyLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGb290ZXJDb250cm9sbGVyJ1xyXG4gICAgfTtcclxufSk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHBcIikuZGlyZWN0aXZlKFwiZm9vdGVyTmF2XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL25hdmlnYXRpb24vZm9vdGVyLW5hdi5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiAnRm9vdGVyQ29udHJvbGxlcidcclxuICAgIH07XHJcbn0pOyIsImFuZ3VsYXIubW9kdWxlKFwiYXBwXCIpLmRpcmVjdGl2ZShcImhlYWRlclwiLCBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9oZWFkZXIuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0hlYWRlckNvbnRyb2xsZXInXHJcbiAgICB9O1xyXG59KTsiLCJhbmd1bGFyLm1vZHVsZShcImFwcFwiKS5kaXJlY3RpdmUoXCJoZWFkZXJOYXZcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbmF2aWdhdGlvbi9oZWFkZXItbmF2Lmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIZWFkZXJDb250cm9sbGVyJ1xyXG4gICAgfTtcclxufSk7IiwiKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIENhdGVnb3J5ID0gZnVuY3Rpb24oJGh0dHApe1xyXG4gICAgICAgIHZhciBBcGlTb3VyY2UgPSBhcGlQcmVmaXggKyAnY2F0ZWdvcmllcyc7XHJcblxyXG4gICAgICAgIHZhciBzdWNjZXNzID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5kYXRhOyB9LFxyXG4gICAgICAgICAgICBlcnJvciA9IGZ1bmN0aW9uIChlcnJvcikgeyByZXR1cm4gZXJyb3IuZGF0YTsgfTtcclxuXHJcbiAgICAgICAgdmFyIGdldEFsbCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoQXBpU291cmNlKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3VjY2VzcywgZXJyb3IpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnZXRTaW5nbGUgPSBmdW5jdGlvbihzbHVnKXtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChBcGlTb3VyY2UgKyAnLycgKyBzbHVnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3VjY2VzcywgZXJyb3IpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnZXRRdW90ZXMgPSBmdW5jdGlvbihzbHVnKXtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChBcGlTb3VyY2UgKyAnLycgKyBzbHVnICsgJy9xdW90ZXMnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3VjY2VzcywgZXJyb3IpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFsbDogZ2V0QWxsLFxyXG4gICAgICAgICAgICBzaW5nbGU6IGdldFNpbmdsZSxcclxuICAgICAgICAgICAgcXVvdGVzOiBnZXRRdW90ZXNcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdDYXRlZ29yeScsIENhdGVnb3J5KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuXHJcbiAgICB2YXIgTmF2aWdhdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIG1lbnVNb2NrZWQgPSBbXHJcbiAgICAgICAgICAgIHsgdXJsOiAnIycsIHRpdGxlOiAnUHJhdmlsYSBrb3JpxaHEh2VuamEnIH0sXHJcbiAgICAgICAgICAgIHsgdXJsOiAnIycsIHRpdGxlOiAnUG9saXNhIHByaXZhdG5vc3RpJyB9LFxyXG4gICAgICAgICAgICB7IHVybDogJyMnLCB0aXRsZTogJ0tvbnRha3QnIH0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdmFyIGdldEhlYWRlck1lbnUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gbWVudU1vY2tlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZ2V0Rm9vdGVyTWVudSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW51TW9ja2VkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdldEhlYWRlck1lbnU6IGdldEhlYWRlck1lbnUsXHJcbiAgICAgICAgICAgIGdldEZvb3Rlck1lbnU6IGdldEZvb3Rlck1lbnVcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdOYXZpZ2F0aW9uJywgTmF2aWdhdGlvbik7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIFF1b3RlID0gZnVuY3Rpb24oJGh0dHAsIG1lZGlhKXtcclxuXHJcbiAgICAgICAgdmFyIGdldExpc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdxdW90ZXMnLCB7Y2FjaGU6dHJ1ZX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZ2V0U2luZ2xlID0gZnVuY3Rpb24oc2x1Zyl7XHJcbiAgICAgICAgICAgIHZhciBxdW90ZTtcclxuICAgICAgICAgICAgdmFyIHBvc3RNZWRpYSA9IHsgaXRlbXM6bnVsbCB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChhcGlQcmVmaXggKyAncXVvdGVzLycrc2x1ZylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3QgPSByZXNwb25zZS5kYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocG9zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWVkaWEubGlzdChwb3N0LklEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RNZWRpYS5pdGVtcyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0Lm1lZGlhID0gcG9zdE1lZGlhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxpc3Q6IGdldExpc3QsXHJcbiAgICAgICAgICAgIHNpbmdsZTogZ2V0U2luZ2xlXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZmFjdG9yeSgnUXVvdGUnLCBRdW90ZSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgU2l0ZSA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHZhciBnZXRMb2dvID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICdtZWRpYS9sb2dvLnBuZyc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGdldENvcHlyaWdodCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ011ZHJvc3RpLm9yZ0AyMDE1LCBTdmEgcHJhdmEgemFkcsW+YW5hJztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRMb2dvOiBnZXRMb2dvLFxyXG4gICAgICAgICAgICBnZXRDb3B5cmlnaHQ6IGdldENvcHlyaWdodFxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmZhY3RvcnkoJ1NpdGUnLCBTaXRlKTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=