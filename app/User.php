<?php namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

use Vazmer\Media\MediaTrait;
use Vazmer\Media\MediaInterface;


/**
 * Class User
 * @package App
 */
class User extends Model implements AuthenticatableContract, CanResetPasswordContract, MediaInterface {

	use Authenticatable, CanResetPassword, SoftDeletes, MediaTrait;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['first_name', 'last_name', 'email', 'password'];

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['password', 'remember_token'];

	/**
	 * Media fields
	 *
	 * @var array
	 */
	public $media_fields = array(
		'avatar' => 'single'
	);


	/**
	 * Sets password attribute
	 *
	 * @param string $password
	 */
	public function setPasswordAttribute($password){
		if(!$password){
			unset($this->attributes['password']);
			return;
		}
		$this->attributes['password'] = bcrypt($password);
	}

	/**
	 * Get name
	 *
	 * @return string
	 */
	public function getName(){
		return $this->first_name.' '.$this->last_name;
	}

}
