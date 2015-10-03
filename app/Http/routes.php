<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::pattern('id', '[0-9]+');
Route::pattern('slug', '[a-z0-9-]+');

Route::get('/{slug}', function() { return View::make('index-ng'); });

Route::group(['prefix' => 'admin', 'namespace' => 'Admin'], function(){
    require __DIR__.'/admin_routes.php';
});

Route::group(['prefix' => 'api', 'namespace' => 'Api'], function(){
	require __DIR__.'/api_routes.php';
});