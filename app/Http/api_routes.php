<?php

Route::get('quotes/{slug}', 'QuoteController@show');

Route::get('categories', 'CategoryController@index');
Route::get('categories/{id}', 'CategoryController@show');
Route::get('categories/{id}/quotes', 'CategoryController@quotes');

Route::get('authors', 'AuthorController@index');
Route::get('authors/{id}', 'AuthorController@show');
Route::get('authors/{id}/quotes', 'AuthorController@quotes');