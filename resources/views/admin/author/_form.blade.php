@section('modal')
    @include('admin.media._modal')
@endsection

@include('admin.partials.fields._image-field', ['id' => 'media_id', 'label' => 'Image', 'media' => isset($media) ? $media :  null, 'prefix' => 'author'])

@include('admin.partials.fields._text-field', ['id' => 'name', 'label' => 'Name'])

@include('admin.partials.fields._text-field', ['id' => 'slug', 'label' => 'Slug'])

@include('admin.partials.fields._textarea-field', ['id' => 'about', 'label' => 'About'])

@include('admin.partials.fields._submit-field', ['label' => $submitButtonText])

@section('scripts')
    {!! \Html::script('/admin/scripts/author.js') !!}
@append