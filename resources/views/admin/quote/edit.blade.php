@extends('admin.layouts.app')

@section('content')
    @include('flash::message')
    @include('admin.errors._messages')

    {!! Form::model($quote, ['method'=>'PATCH', 'action'=>['Admin\QuoteController@update', $quote->id], 'files'=>true]) !!}
        @include('admin.quote._form', ['submitButtonText'=>'Update quote'])
    {!! Form::close() !!}
@stop