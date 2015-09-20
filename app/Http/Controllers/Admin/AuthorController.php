<?php

namespace App\Http\Controllers\Admin;

use App\Author;
use App\Category;
use App\Http\Requests\AuthorRequest;
use App\Http\Requests\CategoryRequest;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class AuthorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
		return view('admin.author.index')
			->withTitle('Authors');
	}

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
		return view('admin.author.create')
			->withTitle('Create author');
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param AuthorRequest|Request $request
	 *
	 * @return Response
	 */
    public function store(AuthorRequest $request)
    {
		$author = Author::create($request->all());

		flash()->success("Author has been successfully created!");

		return redirect()->route('admin.authors.edit', $author)->withInput();
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
	 * @param Author $author
	 *
	 * @return Response
	 * @internal param int $id
	 */
    public function edit(Author $author)
    {
		return view('admin.author.edit', compact('author'))
			->withTitle('Edit: '.$author->name)
			->withMedia($author->media()->getResults());
    }


	/**
	 * Update the specified resource in storage.
	 *
	 * @param AuthorRequest|Request $request
	 * @param Author                $author
	 *
	 * @return Response
	 * @internal param int $id
	 */
    public function update(AuthorRequest $request, Author $author)
    {
		$author->update($request->all());

		flash()->success("Author has been successfully updated!");

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
	 * Return authors's data in a way that can be read by Datatables
	 *
	 * @return Response
	 */
	public function getDatatable()
	{
		$authors = Author::select();

		$datatables = \Datatables::of($authors)->addColumn('deleted_at', function ($author)
		{
			return $author->deleted_at == null ? '<span class="label label-sm label-success">Active</span>' : '<span class="label label-sm label-danger">Deleted</span>';
		})->addColumn('created_at', function ($author)
		{
			return date('F j, Y, g:i a', strtotime($author->created_at));
		})->addColumn('updated_at', function ($author)
		{
			return date('F j, Y, g:i a', strtotime($author->created_at));
		})->addColumn('actions', function ($author)
		{
			return '<a href="' . url('admin/authors/' . $author->id . '/edit') . '" class="btn btn-success btn-sm" ><span class="glyphicon glyphicon-pencil"></span>  Edit</a>';
		});

		$filters = \Input::get('filters');

		if ( ! empty( $filters ) )
		{
			$datatables->filter(function ($query) use ($filters)
			{
				foreach ($filters as $fName => $fValue)
				{
					if ( ! $fValue )
					{
						continue;
					}

					switch ($fName)
					{
						case 'id':
							$query->where('author.id', '=', $fValue);
							break;
						case 'name':
						case 'slug':
						case 'description':
							$query->where('slug', 'LIKE', '%'.$fValue.'%');
							break;
						case 'created_at_from':
							$query->where('created_at', '>=', $fValue);
							break;
						case 'created_at_to':
							$query->where('created_at', '<=', $fValue);
							break;
						case 'updated_at_from':
							$query->where('updated_at', '>=', $fValue);
							break;
						case 'updated_at_to':
							$query->where('updated_at', '<=', $fValue);
							break;
						case 'deleted':
							if ( $fValue )
							{
								if ( $fValue == 1 )
								{
									$query->whereNull('deleted_at');
								}
								if ( $fValue == -1 )
								{
									$query->where('deleted_at', '!=', 'null');
								}
							}
							break;
					}
				}
			});
		}

		return $datatables->make(true);
	}
}
