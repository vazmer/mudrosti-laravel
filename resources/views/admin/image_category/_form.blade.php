@section('modal')
    @include('admin.media._modal')
@endsection

@include('admin.partials.fields._image-field', ['id' => 'media_id', 'label' => 'Image', 'media' => isset($media) ? $media :  null, 'prefix' => 'image_category'])

@include('admin.partials.fields._text-field', ['id' => 'name', 'label' => 'Name'])

@include('admin.partials.fields._select-field', ['id' => 'parent_id', 'label' => 'Parent category', 'list' => $categories])

@include('admin.partials.fields._submit-field', ['label' => $submitButtonText])

@section('scripts')
    {!! \Html::script('/admin/scripts/image_category.js') !!}
@append