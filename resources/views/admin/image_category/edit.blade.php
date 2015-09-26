@extends('admin.layouts.app')

@section('content')
    @include('flash::message')
    @include('admin.errors._messages')

    {!! Form::model($category, ['method'=>'PATCH', 'action'=>['Admin\ImageCategoryController@update', $category->id], 'files'=>true]) !!}
        @include('admin.image_category._form', ['submitButtonText'=>'Update category of images'])
    {!! Form::close() !!}
@stop