<?php namespace App\Http\Controllers\Admin;

use App\User;
use App\Http\Requests\UserRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return view('admin.user.index')
            ->withTitle('Users');
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.user.create')
            ->withTitle('Create user');
	}

    /**
     * Store a newly created resource in storage.
     *
     * @param UserRequest $request
     * @return Response
     */
	public function store(UserRequest $request)
	{
		$user = User::create($request->all());

        flash()->success("User has been successfully created!");

        return redirect()->route('admin.users.edit', $user)->withInput();
    }


	/**
	 * Display the specified resource.
	 *
	 * @param User $user
	 * @return Response
	 */
	public function show(User $user)
	{

	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param User $user
	 * @return Response
	 */
	public function edit(User $user)
	{
		return view('admin.user.edit', compact('user'))
            ->withTitle('Edit: '.$user->first_name.' '.$user->last_name)
            ->withAvatar($user->getMedia('avatar'));
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param UserRequest $request
	 * @param User $user
	 * @return Response
	 */
	public function update(UserRequest $request, User $user)
	{
        $user->update($request->all());

		$user->uploadAndSave();

		flash()->success("User has been successfully updated!");

        return redirect()->back()->withInput();
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  User  $user
	 * @return Response
	 */
	public function destroy(User $user)
	{
		//
	}

    /**
    * Return user's data in a way that can be read by Datatables
    *
    * @return Response
    */
    public function getDatatable()
    {
		$users = User::all(array('id', DB::raw('concat(first_name,\' \', last_name) as name'), 'created_at', 'updated_at'));

		return \Datatable::collection($users)
            ->showColumns('id', 'name', 'created_at', 'updated_at')
            ->searchColumns('name')
            ->orderColumns('id', 'name', 'created_at', 'updated_at')
            ->addColumn('actions', function($user){
                return '<a href="'.url('admin/users/'.$user->id.'/edit').'" class="btn btn-success btn-sm" ><span class="glyphicon glyphicon-pencil"></span>  Edit</a>';
            })
            ->make();
    }

}