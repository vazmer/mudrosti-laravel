@extends('admin.layouts.app')

@section('content')
    @include('flash::message')
    @include('admin.errors._messages')

    {!! Form::model($author, ['method'=>'PATCH', 'action'=>['Admin\AuthorController@update', $author->id], 'files'=>true]) !!}
        @include('admin.author._form', ['submitButtonText'=>'Update author'])
    {!! Form::close() !!}
@stop