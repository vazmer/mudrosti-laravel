var Author = function (){

    return {
        init: function(){
            var $thumb = $('#author_image');
            $thumb.find('img').click(function() {
                Media.setSrc($thumb.find('img'), $thumb.find('input'));
                Media.openModal();
            });

            ;
            $thumb.find('#author_image_reset').click(function() {
                $thumb.find('img').attr('src', 'http://placehold.it/250x150');
                $thumb.find('input').val('');
            });
        }
    };

}();

Author.init();