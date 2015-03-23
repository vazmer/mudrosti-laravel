<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!--> <html lang="en"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
    <meta charset="utf-8"/>
    <title>Metronic | Admin Dashboard Template</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>

    @include('admin.partials.styles')
    @yield('style')

    <link rel="shortcut icon" href="favicon.ico"/>
</head>
<!-- END HEAD -->
<body class="login">

<!-- BEGIN CONTENT -->
<div class="content">
    @if(isset($title))
        <h1 class="page-title">{{ $title }}</h1>
    @endif
    @yield('content')
</div>
<!-- END CONTENT -->

@include('admin.partials._footer')

@include('admin.partials.scripts')
@yield('scripts')
</body>
</html>

