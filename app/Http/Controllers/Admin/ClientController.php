<?php namespace App\Http\Controllers\Admin;

use App\User;
use App\Client;
use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;

class ClientController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return view('admin.client.index')
			->withTitle('Clients');
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.client.create')
			->withTitle('Create client');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(ClientRequest $clientRequest)
	{
		\DB::beginTransaction();

		try
		{
			$user = User::create($clientRequest->all()['user']);
		}
		catch(\Exception $ex)
		{
			\DB::rollback();
			flash()->error($ex->getMessage());
			redirect()->route('admin.users.create')->withInput();
			throw $ex;
		}

		try
		{
			$client = Client::create(array_add($clientRequest->all(), 'user_id', $user->id));
		}
		catch(\Exception $ex)
		{
			\DB::rollback();
			flash()->error($ex->getMessage());
			redirect()->route('admin.users.create')->withInput();
			throw $ex;
		}

		flash()->success("User has been successfully created!");

		\DB::commit();

		return redirect()->route('admin.clients.edit', [$user, $client])->withInput();
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  Client  $client
	 * @return Response
	 */
	public function edit(Client $client)
	{
		$user = $client->user;
		return view('admin.client.edit', compact(['user', 'client']))
			->withTitle('Edit: '.$user->first_name.' '.$user->last_name)
			->withAvatar($user->getMedia('avatar'));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update(ClientRequest $request, Client $client)
	{
		$clientData = $request->all();

		\DB::beginTransaction();

		try
		{
			unset($clientData['user']['password_confirmation']);
			$user = $client->user;
			$user->update($clientData['user']);
		}
		catch(\Exception $ex)
		{
			\DB::rollback();
			flash()->error($ex->getMessage());
			redirect()->route('admin.clients.edit')->withInput();
			throw $ex;
		}

		try
		{
			$client->update($clientData);
		}
		catch(\Exception $ex)
		{
			\DB::rollback();
			flash()->error($ex->getMessage());
			redirect()->route('admin.clients.edit')->withInput();
			throw $ex;
		}

		flash()->success("Client has been successfully updated!");

		\DB::commit();

		return redirect()->back()->withInput();
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

	/**
	 * Return client's data in a way that can be read by Datatables
	 *
	 * @return Response
	 */
	public function getDatatable()
	{
 		$clients = \DB::table('clients')->join('users', 'users.id', '=', 'clients.user_id')
			->select(array('clients.id', \DB::raw('concat(first_name,\' \', last_name) as name'), 'phone', 'clients.created_at',
				'clients.updated_at'));

		$filters = \Input::get('filters');
		if(!empty($filters))
		{
			foreach($filters as $fName => $fValue)
			{
				if(!$fValue) continue;

				switch($fName){
					case 'id':
						$clients->where('clients.id', 'like', '%'.$fValue.'%');
						break;
					case 'name';
						$clients->where(function($query)  use ($fValue)
						{
							$query->orWhere('first_name', 'like', '%'.$fValue.'%');
							$query->orWhere('last_name', 'like', '%'.$fValue.'%');
						});
						break;
					case 'phone';
						$clients->where('phone', 'like', '%'.$fValue.'%');
						break;
					case 'created_at_from';
						$clients->where('clients.created_at', '>=', $fValue);
						break;
					case 'created_at_to';
						$clients->where('clients.created_at', '<=', $fValue);
						break;
					case 'updated_at_from';
						$clients->where('clients.updated_at', '>=', $fValue);
						break;
					case 'updated_at_to';
						$clients->where('clients.updated_at', '<=', $fValue);
						break;

				}
			}
		}

		return \Datatable::query($clients)
			->showColumns('id', 'name', 'phone', 'created_at', 'updated_at')
			//->setAliasMapping()
			//->setSearchWithAlias()
			->searchColumns('first_name', 'last_name', 'phone')
			->orderColumns('id', 'name', 'phone', 'created_at', 'updated_at')
			->addColumn('actions', function($client){
				return '<a href="'.url('admin/clients/'.$client->id.'/edit').'" class="btn btn-success btn-sm" ><span class="glyphicon
				glyphicon-pencil"></span>  Edit</a>';
			})
			->make();
	}

}
