<!DOCTYPE html>
<html>
<head>
    <base href="/">
    <title>Mudrosti</title>

    <link rel="stylesheet" href="assets/css/app.css"/>
    <link rel="stylesheet"
          href="http://fonts.googleapis.com/css?family=Open+Sans:100italic,300italic,400italic,600italic,700italic,800italic,100,300,400,600,700,800"/>
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto+Slab:100"/>
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Dosis:200,300,400,700"/>

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <!-- load angular and angular route via CDN -->
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-route/angular-route.min.js"></script>
    <!--<script src="bower_components/angular-animate/angular-animate.min.js"></script>-->
    <script src="app/prod/ng-app.js"></script>
</head>
<body ng-app="app">
    <header class="header" data-header ng-class="{loaded:isLoaded}"></header>
    <div ng-view="index.html"></div>
    <footer class="footer" footer ng-class="{loaded:isLoaded}"></footer>
</body>
</html>
