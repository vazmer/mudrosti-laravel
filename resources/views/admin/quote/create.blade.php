@extends('admin.layouts.app')

@section('content')
    @include('admin.errors._messages')

    {!! Form::open(['method'=>'POST', 'action'=>'Admin\QuoteController@store']) !!}
        @include('admin.quote._form', ['submitButtonText'=>'Add quote'])
    {!! Form::close() !!}
@stop