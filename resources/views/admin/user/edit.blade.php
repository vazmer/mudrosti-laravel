@extends('admin.layouts.app')

@section('content')
    @include('flash::message')
    @include('admin.errors._messages')

    {!! Form::model($user, ['method'=>'PATCH', 'action'=>['Admin\UserController@update', $user->id], 'files'=>true]) !!}
        @include('admin.user._form', ['submitButtonText'=>'Update user'])
    {!! Form::close() !!}
@stop