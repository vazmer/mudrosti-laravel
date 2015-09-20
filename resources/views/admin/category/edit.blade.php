@extends('admin.layouts.app')

@section('content')
    @include('flash::message')
    @include('admin.errors._messages')

    {!! Form::model($category, ['method'=>'PATCH', 'action'=>['Admin\CategoryController@update', $category->id], 'files'=>true]) !!}
        @include('admin.category._form', ['submitButtonText'=>'Update category'])
    {!! Form::close() !!}
@stop