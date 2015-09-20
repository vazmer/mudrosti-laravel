var Media = function () {

    var currentPage = 1,
        $modal = $('#media-modal'),
        $mediaFiles = $('#media-files'),
        mediaURL = $('input[name=library_ajax_url]').val(),
        insertTo = {
            $fileSrc: null,
            $idSrc: null
        };

    var openModal = function(){
        $modal.modal('show');
    };

    var closeModal = function(){
        $modal.modal('hide');
    };

    var loadImages = function(){
        $.ajax({
            url: mediaURL,
            cache: false,
            data: {
                'page': currentPage
            }
        }).success(function(html) {
            $mediaFiles.html(html);

            var $thumbs = $mediaFiles.find('.thumbnail');
            $thumbs.click(function(){
                $thumbs.removeClass('active');
                $(this).addClass('active');
            });
        });
    };

    var setSrc = function(file, id){
        insertTo.$fileSrc = file;
        insertTo.$idSrc = id;
    };

    var insertFileIntoSrc = function(){
        insertTo.$fileSrc.attr('src', getSelectedMedia().path);
        insertTo.$idSrc.val(getSelectedMedia().id);
        closeModal();
    };

    var getSelectedMedia = function(){
        var $selectedMedia = $mediaFiles.find('.thumbnail.active');
        return {
            path: $selectedMedia.find('img').attr('src'),
            id: $selectedMedia.find('.media_id').val()
        }
    };

    return {
        //main function to initiate the module
        init: function () {

            // init plugins
            Dropzone.options.myDropzone = {
                uploadMultiple: false,
                init: function() {
                    this.on("success", function(file) {
                        loadImages();
                        $('a[href="#tab_library"]').tab('show');
                    });
                }
            };

            // events
            $('#insert_media').click(function(){
                insertFileIntoSrc();
            });

            setTimeout(function(){
                // preload data
                loadImages();
            }, 2000);
        },
        loadImages: loadImages,
        openModal: openModal,
        setSrc: setSrc
    };
}();

Media.init();
