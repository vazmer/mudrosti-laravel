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