<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\ImageCategory
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
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereParentId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereMediaId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\ImageCategory whereDeletedAt($value)
 */
class ImageCategory extends Model
{
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'image_categories';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['media_id', 'parent_id', 'name'];

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
		return $this->belongsTo('App\ImageCategory', 'parent_id');
	}

	/**
	 * @return \Illuminate\Database\Eloquent\Relations\HasMany
	 */
	public function categories()
	{
		return $this->hasMany('App\ImageCategory', 'parent_id');
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
}
