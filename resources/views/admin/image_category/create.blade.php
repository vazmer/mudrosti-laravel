@extends('admin.layouts.app')

@section('content')
    @include('admin.errors._messages')

    {!! Form::open(['method'=>'POST', 'action'=>'Admin\ImageCategoryController@store']) !!}
        @include('admin.image_category._form', ['submitButtonText'=>'Add category of images'])
    {!! Form::close() !!}
@stop