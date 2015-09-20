<div id="media-modal" class="modal container fade" tabindex="-1">
    <div class="modal-dialog modal-full">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">Insert Media</h4>
            </div>
            <div class="modal-body">

                <div class="tabbable">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="#tab_upload" data-toggle="tab">Upload File </a>
                        </li>
                        <li>
                            <a href="#tab_library" data-toggle="tab">Media Library </a>
                        </li>
                    </ul>
                    <div class="tab-content no-space">
                        <div class="tab-pane active" id="tab_upload">
                            <div class="form-body">
                                <form action="{{ action('Admin\MediaController@store') }}" class="dropzone" id="my-dropzone">
                                    {!! csrf_field() !!}
                                </form>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab_library">
                            <div id="media-files"></div>
                            {!! Form::hidden('library_ajax_url', action('Admin\MediaController@getTiles')) !!}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-default">Close</button>
                <button type="button" class="btn blue" id="insert_media">Insert</button>
            </div>

        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

@section('style')
    {!! \Html::style('/admin/global/plugins/dropzone/css/dropzone.css') !!}
    {!! \Html::style('/admin/css/media.css') !!}
@append

@section('js-plugins')
    {!! \Html::script('/admin/global/plugins/dropzone/dropzone.js') !!}
@append

@section('scripts')
    {!! \Html::script('/admin/scripts/media.js') !!}
@append
