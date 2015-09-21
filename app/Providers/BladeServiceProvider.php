<?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class BladeServiceProvider extends ServiceProvider
{
	public function boot()
	{
		/*
		|--------------------------------------------------------------------------
		| Extend blade so we can define a variable
		| <code>
		| @define $variable = "whatever"
		| </code>
		|--------------------------------------------------------------------------
		*/
		\Blade::extend(function($value)
		{
			return preg_replace('/\@define(.+)/', '<?php ${1}; ?>', $value);
		});
	}

	public function register()
	{
		//
	}
}