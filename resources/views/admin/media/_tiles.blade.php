@if(!empty($files))
    
    <div class="row">
        @foreach($files as $file)
            <div class="col-sm-6 col-md-3 col-lg-2">
                <div class="thumbnail">
                    <img src="{{ url($file->file_path) }}" alt=""/>
                    <input type="hidden" class="media_id" value="{{ $file->id }}"/>
                </div>
            </div>
        @endforeach
    </div>
    
@endif