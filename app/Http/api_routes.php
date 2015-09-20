<?php

//Route::resource('quote-collections', 'QuoteController', ['only' => ['index', 'show']]);

Route::get('quote/{slug}', 'QuoteController@show');