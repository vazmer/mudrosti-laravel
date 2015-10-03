<?php

Route::get('quotes/{slug}', 'QuoteController@show');

Route::get('categories', 'CategoryController@index');
Route::get('categories/{slug}', 'CategoryController@show');
Route::get('categories/{slug}/quotes', 'CategoryController@quotes');

Route::get('authors', 'AuthorController@index');
Route::get('authors/{slug}', 'AuthorController@show');
Route::get('authors/{slug}/quotes', 'AuthorController@quotes');