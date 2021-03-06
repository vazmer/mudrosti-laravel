<?php

namespace App\Http\Controllers\Api;

use App\Quote;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Response;

class QuoteController extends Controller
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
			$quotes = Quote::all();
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
	 * @internal param int $id
	 */
    public function show($slug)
    {
		try
		{
			$quote = Quote::where(['slug'=>$slug])->firstOrFail();
			$statusCode = 200;
			$response = [
				'data'  => $quote
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
