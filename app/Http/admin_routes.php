<?php

Route::controllers([
    'auth' => 'Auth\AuthController',
    'password' => 'Auth\PasswordController',
]);

Route::group(['middleware' => 'auth'], function(){
    Route::pattern('id', '[0-9]+');
    Route::pattern('id2', '[0-9]+');

	Route::post('media/store', array('as'=>'media.store', 'uses'=>'MediaController@store'));
	Route::get('media/tiles', array('as'=>'media.tiles', 'uses'=>'MediaController@getTiles'));
	Route::get('api/media', array('as'=>'api.media', 'uses'=>'MediaController@getDatatable'));

	Route::resource('users', 'UserController');
    Route::get('api/users', array('as'=>'api.users', 'uses'=>'UserController@getDatatable'));
	
	Route::resource('quotes', 'QuoteController');
	Route::get('api/quotes', array('as'=>'api.quotes', 'uses'=>'QuoteController@getDatatable'));

	Route::resource('categories', 'CategoryController');
	Route::get('api/categories', array('as'=>'api.categories', 'uses'=>'CategoryController@getDatatable'));

	Route::resource('authors', 'AuthorController');
	Route::get('api/authors', array('as'=>'api.authors', 'uses'=>'AuthorController@getDatatable'));
});