<?php

namespace App\Http\Controllers\Admin;

use App\Author;
use App\Category;
use App\Quote;
use App\Http\Requests\QuoteRequest;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class QuoteController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return view('admin.quote.index')
			->withTitle('Quotes');
	}
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
		$authors = Author::lists('name', 'id')->all();
		$categories = Category::lists('name', 'id')->all();

		return view('admin.quote.create')
			->withTitle('Create quote')
			->withAuthors($authors)
			->withCategories($categories);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param QuoteRequest $request
	 *
	 * @return Response
	 */
	public function store(QuoteRequest $request)
	{
		$quote = Quote::create($request->all());

		flash()->success("Quote has been successfully created!");

		return redirect()->route('admin.quotes.edit', $quote)->withInput();
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
	 * @param Quote $quote
	 *
	 * @return Response
	 * @internal param int $id
	 */
	public function edit(Quote $quote)
	{
		$authors = Author::lists('name', 'id')->all();
		$categories = Category::lists('name', 'id')->all();

		return view('admin.quote.edit', compact('quote'))
			->withTitle('Edit: '.$quote->title)
			->withAuthors($authors)
			->withCategories($categories);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param QuoteRequest $request
	 * @param Quote        $quote
	 *
	 * @return Response
	 * @internal param int $id
	 */
	public function update(QuoteRequest $request, Quote $quote)
    {
		$quote->update($request->all());

		/**
		 * @var array $selectedCategoriesIds
		 * empty items are removed
		 */
		$selectedCategoriesIds = array_except($request->input('categories'), ['']);

		$quote->categories()->sync($selectedCategoriesIds);

		flash()->success("Quote has been successfully updated!");

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
	 * Return quotes's data in a way that can be read by Datatables
	 *
	 * @return Response
	 */
	public function getDatatable()
	{

		$quotes = Quote::select();

		$datatables = \Datatables::of($quotes)->addColumn('deleted_at', function ($quote)
		{
			return $quote->deleted_at == null ? '<span class="label label-sm label-success">Active</span>' : '<span class="label
				label-sm label-danger">Deleted</span>';
		})->addColumn('created_at', function ($quote)
		{
			return date('F j, Y, g:i a', strtotime($quote->created_at));
		})->addColumn('updated_at', function ($quote)
		{
			return date('F j, Y, g:i a', strtotime($quote->created_at));
		})->addColumn('actions', function ($quote)
		{
			return '<a href="' . url('admin/quotes/' . $quote->id . '/edit') . '" class="btn btn-success btn-sm" ><span class="glyphicon
				glyphicon-pencil"></span>  Edit</a>';
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
						case 'id';
							$query->where('quote.id', '=', $fValue);
							break;
						case 'slug';
							$query->where('slug', 'LIKE', '%'.$fValue.'%');
							break;
						case 'text';
							$query->where('text', 'LIKE', '%'.$fValue.'%');
							break;
						case 'created_at_from';
							$query->where('created_at', '>=', $fValue);
							break;
						case 'created_at_to';
							$query->where('created_at', '<=', $fValue);
							break;
						case 'updated_at_from';
							$query->where('updated_at', '>=', $fValue);
							break;
						case 'updated_at_to';
							$query->where('updated_at', '<=', $fValue);
							break;
						case 'deleted';
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
