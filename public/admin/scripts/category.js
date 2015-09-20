var Category = function (){

    return {
        init: function(){
            var $thumb = $('#category_image');
            $thumb.find('img').click(function() {
                Media.setSrc($thumb.find('img'), $thumb.find('input'));
                Media.openModal();
            });

            ;
            $thumb.find('#category_image_reset').click(function() {
                $thumb.find('img').attr('src', 'http://placehold.it/250x150');
                $thumb.find('input').val('');
            });
        }
    };

}();

Category.init();