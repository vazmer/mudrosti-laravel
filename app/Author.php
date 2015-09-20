<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Author extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'authors';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [ 'media_id', 'name', 'slug', 'about' ];

	/**
	 * Media fields
	 *
	 * @var array
	 */
	public $media_fields = [ 'image' ];


	/**
	 * Get the media that belongs to category.
	 */
	public function media()
	{
		return $this->belongsTo('App\Media', 'media_id');
	}

	public static function keyValueMapped($items) {
		$categories = array();
		$items->map(function($item) use (&$categories) {
			$categories[$item->id] = $item->name;
		});
		return $categories;
	}

	/**
	 * Get key-mapped array of categories with empty first item (label)
	 *
	 * @return array
	 */
	public static function getSelectOptions() {
		return array_merge(['0'=>'Choose'], Author::keyValueMapped(Author::all()));
	}
}
