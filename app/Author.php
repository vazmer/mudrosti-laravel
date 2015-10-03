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
		return $this->belongsTo('Vazmer\Media\Media', 'media_id');
	}

	/**
	 * Get the quotes that belongs to author.
	 */
	public function quotes()
	{
		return $this->hasMany('App\Quote');
	}
}
