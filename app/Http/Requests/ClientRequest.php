<?php namespace App\Http\Requests;

use App\Http\Requests\Request;

class ClientRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return \Auth::check();
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$rules = [
			//'phone' => 'regex:/[0-9]{10,11}/'
		];

		return array_merge($rules, $this->user_rules());
	}


	/**
	 * Get the validation rules for user fields that apply to the request
	 *
	 * @return array
	 */
	public function user_rules()
	{
		$rules = [
			'user.first_name' => 'required',
			'user.last_name' => 'required',
			'user.email' => 'required|unique:users',
			'user.password' => 'required|min:8|confirmed'
		];

		if($this->isMethod('patch')){
			$rules['user.email'] = 'required';
			$rules['user.password'] = 'min:8|confirmed';
		}
		return $rules;
	}

}
