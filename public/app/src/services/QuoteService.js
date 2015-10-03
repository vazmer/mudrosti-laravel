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