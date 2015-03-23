@extends('admin.layouts.app')

@section('content')
    @include('admin.errors._messages')

    {!! Form::open(['method'=>'POST', 'action'=>'Admin\UserController@store']) !!}
        @include('admin.user._form', ['submitButtonText'=>'Add user'])
    {!! Form::close() !!}
@stop