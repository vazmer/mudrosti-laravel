<?php

namespace App\Http\Controllers\Api;

use App\Author;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Response;

class AuthorController extends Controller
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
			$quotes = Author::all();
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
	 * @param $id
	 *
	 * @return Response
	 * @internal param int $id
	 */
    public function show($id)
    {
		try
		{
			$data = Author::where(['id'=>$id])->firstOrFail();
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
	 * Display the quotes for given author.
	 *
	 * @param $id
	 *
	 * @return Response
	 * @internal param int $id
	 */
	public function quotes($id)
	{
		try
		{
			$author = Author::find($id);

			$statusCode = 200;
			$response = [
				'data'  => $author->quotes()->get()
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