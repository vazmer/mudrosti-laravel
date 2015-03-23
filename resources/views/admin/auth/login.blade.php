@extends('admin.layouts.login')

@section('style')
    {!! Html::style('/admin/pages/css/login.css') !!}
@append

@section('content')
<form class="login-form" role="form" method="POST" action="{{ url('/admin/auth/login') }}">
    <h1 class="form-title">Login</h1>

    <div class="alert alert-danger display-hide">
        @if (count($errors) > 0)
            <strong>Whoops!</strong> There were some problems with your input.<br><br>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        @endif
    </div>

    <input type="hidden" name="_token" value="{{ csrf_token() }}">

    <div class="form-group">
        <input type="email" class="form-control" name="email" value="{{ old('email') }}" placeholder="Email">
    </div>

    <div class="form-group">
        <input type="password" class="form-control" name="password" placeholder="Password">
    </div>

    <div class="form-actions">
        <button type="submit" class="btn btn-success uppercase">Login</button>
        <label class="rememberme check">
            <div class="checker"><span class=""><input type="checkbox" name="remember" value="1"></span></div>Remember
        </label>
        <a class="btn btn-link" href="{{ url('/admin/password/email') }}">Forgot Password?</a>
    </div>
</form>
@endsection
