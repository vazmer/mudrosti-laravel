@extends('admin.layouts.app')

@section('content')
    @include('admin.errors._messages')

    {!! Form::open(['method'=>'POST', 'action'=>'Admin\ClientController@store']) !!}
        @include('admin.client._form', ['submitButtonText'=>'Add client'])
    {!! Form::close() !!}
@stop