<?php

namespace App\Http\Controllers\Admin;

use App\ImageCategory;
use App\Http\Requests\ImageCategoryRequest;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ImageCategoryController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return view('admin.image_category.index')
			->withTitle('Categories of Images');
	}
	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		$categories = ImageCategory::lists('name', 'id')->all();
		
		return view('admin.image_category.create')
			->withTitle('Create category of images')
			->withCategories($categories);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param ImageCategoryRequest $request
	 *
	 * @return Response
	 */
	public function store(ImageCategoryRequest $request)
	{
		$category = ImageCategory::create($request->all());

		flash()->success("Category of images has been successfully created!");

		return redirect()->route('admin.categories-of-images.edit', $category)->withInput();
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
	 * @param ImageCategory $category
	 *
	 * @return Response
	 * @internal param int $id
	 */
	public function edit(ImageCategory $category)
	{
		$categories = ImageCategory::lists('name', 'id')->all();

		return view('admin.image_category.edit', compact('category'))
			->withTitle('Edit: '.$category->name)
			->withMedia($category->media()->getResults())
			->withCategories($categories);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param ImageCategoryRequest $request
	 * @param ImageCategory        $category
	 *
	 * @return Response
	 * @internal param int $id
	 */
	public function update(ImageCategoryRequest $request, ImageCategory $category)
	{
		$category->update($request->all());

		flash()->success("Category of images has been successfully updated!");

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
	 * Return categories's data in a way that can be read by Datatables
	 *
	 * @return Response
	 */
	public function getDatatable()
	{
		$categories = ImageCategory::select();

		$datatables = \Datatables::of($categories)->addColumn('deleted_at', function ($category)
		{
			return $category->deleted_at == null ? '<span class="label label-sm label-success">Active</span>' : '<span class="label label-sm label-danger">Deleted</span>';
		})->addColumn('created_at', function ($category)
		{
			return date('F j, Y, g:i a', strtotime($category->created_at));
		})->addColumn('updated_at', function ($category)
		{
			return date('F j, Y, g:i a', strtotime($category->created_at));
		})->addColumn('actions', function ($category)
		{
			return '<a href="' . url('admin/categories/' . $category->id . '/edit') . '" class="btn btn-success btn-sm" ><span class="glyphicon glyphicon-pencil"></span>  Edit</a>';
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
							$query->where('id', '=', $fValue);
							break;
						case 'name':
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
