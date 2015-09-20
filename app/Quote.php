<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Quote
 *
 * @property integer $id
 * @property integer $quote_collection_id
 * @property integer $media_id
 * @property integer $author_id
 * @property string $slug
 * @property string $text
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $deleted_at
 * @property integer $sort_order
 * @property-read \App\Media $media
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereQuoteCollectionId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereMediaId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereAuthorId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereText($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereDeletedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Quote whereSortOrder($value)
 */
class Quote extends Model
{
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'quotes';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['media_id', 'author_id', 'slug', 'text'];

	/**
	 * Media fields
	 *
	 * @var array
	 */
	public $media_fields = ['image'];

	/**
	 * Get the media that belongs to quote.
	 */
	public function media()
	{
		return $this->belongsTo('App\Media', 'media_id');
	}

	/**
	 * Get the author that belongs to quote.
	 */
	public function author()
	{
		return $this->belongsTo('App\Author', 'author_id');
	}
}
