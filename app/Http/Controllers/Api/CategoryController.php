<?php

namespace App\Http\Controllers\Api;

use App\Category;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
		try
		{
			$quotes = Category::all();
			$statusCode = 200;
			$response = [
				'data'  => $quotes
			];
		}
		catch (Exception $e)
		{
			$statusCode = 400;
		}
		finally
		{
			return Response::json($response, $statusCode);
		}
    }


	/**
	 * Display the specified resource.
	 *
	 * @param $slug
	 *
	 * @return Response
	 * @internal param int $slug
	 */
    public function show($slug)
    {
		try
		{
			$data = Category::where(['slug'=>$slug])->firstOrFail();
			$statusCode = 200;
			$response = [
				'data'  => $data
			];
		}
		catch (Exception $e)
		{
			$statusCode = 400;
		}
		finally
		{
			return Response::json($response, $statusCode);
		}
    }

	/**
	 * Display the quotes for given category.
	 *
	 * @param $slug
	 *
	 * @return Response
	 * @internal param int $slug
	 */
	public function quotes($slug)
	{
		try
		{
			$category = Category::where(['slug'=>$slug])->firstOrFail();

			$statusCode = 200;
			$response = [
				'data'  => $category->quotesWithMediaAndAuthor()
			];
		}
		catch (Exception $e)
		{
			$statusCode = 400;
		}
		finally
		{
			return Response::json($response, $statusCode);
		}
	}
}
