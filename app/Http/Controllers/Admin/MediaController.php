<?php

namespace App\Http\Controllers\Admin;

use Vazmer\Media\Media;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Response;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
		$media = new Media();
		$uploadSuccess = $media->uploadAndSave();

		if($uploadSuccess)
		{
			return Response::json('success', 200);
		}
		else
		{
			return Response::json('error', 400);
		}
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
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        //
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
	 * Display a listing of the media files requested over ajax.
	 *
	 * @return Response
	 */
	public function getTiles()
	{
		$files = Media::paginate(40);

		return view('admin.media._tiles', compact('files'));
	}
}
