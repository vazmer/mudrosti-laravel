<?php namespace App\Http\Requests;

class UserRequest extends Request {

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
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|unique:users',
            'password' => 'required|min:8|confirmed'
        ];

        if($this->isMethod('patch')){
            $rules['email'] = 'required';
            $rules['password'] = 'min:8|confirmed';
        }
        return $rules;
	}

}
