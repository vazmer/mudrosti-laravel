@extends('admin.layouts.app')

@section('content')
    @include('admin.errors._messages')

    {!! Form::open(['method'=>'POST', 'action'=>'Admin\AuthorController@store']) !!}
        @include('admin.author._form', ['submitButtonText'=>'Add author'])
    {!! Form::close() !!}
@stop