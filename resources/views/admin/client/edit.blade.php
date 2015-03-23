@extends('admin.layouts.app')

@section('content')
    @include('flash::message')
    @include('admin.errors._messages')

    {!! Form::model($client, ['method'=>'PATCH', 'action'=>['Admin\ClientController@update', $client->id],
    'files'=>true]) !!}
        @include('admin.client._form', ['submitButtonText'=>'Update client'])
    {!! Form::close() !!}
@stop