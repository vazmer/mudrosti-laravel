<!--- {{{ $label }}} Field --->
<div class="form-group" id="{{ $prefix  }}_image">
    {!! Form::label($id, $label.':') !!}
    <div class="thumbnail" style="width: 200px;">
        @if($media)
            <img src="{{ url($media->file_path) }}" alt=""/>
        @else
            <img src="http://placehold.it/250x150" alt=""/>
        @endif
        <a href="#" class="btn btn-default" role="button" id="{{ $prefix }}_image_reset" style="width: 100%; text-align: center;">Reset</a>
        {!! Form::hidden($id, isset($media->id) ? $media->id : '') !!}
    </div>
</div>
