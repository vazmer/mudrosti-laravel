@extends('admin.layouts.app')

@section('content')
    @include('admin.errors._messages')

    {!! Form::open(['method'=>'POST', 'action'=>'Admin\CategoryController@store']) !!}
        @include('admin.category._form', ['submitButtonText'=>'Add category'])
    {!! Form::close() !!}
@stop