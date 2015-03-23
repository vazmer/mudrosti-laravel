<?php

Route::controllers([
    'auth' => 'Auth\AuthController',
    'password' => 'Auth\PasswordController',
]);

Route::group(['middleware' => 'auth'], function(){
    Route::pattern('id', '[0-9]+');
    Route::pattern('id2', '[0-9]+');

    Route::resource('users', 'UserController');
    Route::get('api/users', array('as'=>'api.users', 'uses'=>'UserController@getDatatable'));

	Route::resource('clients', 'ClientController');
	Route::get('api/clients', array('as'=>'api.clients', 'uses'=>'ClientController@getDatatable'));
});