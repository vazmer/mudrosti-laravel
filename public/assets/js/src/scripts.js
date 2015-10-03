jQuery(document).ready(function($) {
    "use strict";

    /*
     * GET WINDOW WIDTH
     */
    var windowWidth = function(){
        return (window.innerWidth) ?
            window.innerWidth :
        document.documentElement.clienWidth || document.body.clienWidth || 0;
    };

    var $bgImage = $('[data-bg]');
    $bgImage.each(function(){
        $(this).css('background-image', 'url('+$(this).data('img')+')');
    });

    var $domsHeight = $('[data-height]');
    $domsHeight.each(function(){
        $(this).css('height', $(this).data('height'));
    });

    var $bgColors = $('[data-bg-color]');
    $bgColors.each(function(){
        $(this).css('background-color', $(this).data('background-color'));
    });

    var initSlider = function($slider){
        $slider.owlCarousel($slider.data('options'));
    };
});