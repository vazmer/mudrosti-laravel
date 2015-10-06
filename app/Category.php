<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Category
 *
 * @property integer $id
 * @property integer $parent_id
 * @property integer $media_id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $deleted_at
 * @property-read \Vazmer\Media\Media $media
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereParentId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereMediaId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Category whereDeletedAt($value)
 */
class Category extends Model
{
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'categories';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['media_id', 'parent_id', 'name', 'slug', 'description'];

	/**
	 * Media fields
	 *
	 * @var array
	 */
	public $media_fields = ['image'];

	/**
	 * Get the media that belongs to category.
	 */
	public function media()
	{
		return $this->belongsTo('Vazmer\Media\Media', 'media_id');
	}

	/**
	 * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
	 */
	public function parent()
	{
		return $this->belongsTo('App\Category', 'parent_id');
	}

	/**
	 * @return \Illuminate\Database\Eloquent\Relations\HasMany
	 */
	public function categories()
	{
		return $this->hasMany('App\Category', 'parent_id');
	}

	/**
	 * Get the quotes associated with the given category.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
	 */
	public function quotes()
	{
		return $this->belongsToMany('App\Quote');
	}

	public function quotesWithMediaAndAuthor()
	{
		$quotes = $this->quotes()->get()->map(function ($quote) {
			$media = $quote->categoriesOfImages()->get()->first();
			$quote->image_url = $media->media->file_path;
			$quote->author = $quote->author;
			return $quote;
		});
		return $quotes;
	}
}
