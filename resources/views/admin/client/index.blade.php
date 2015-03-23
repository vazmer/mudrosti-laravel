@extends('admin.layouts.app')

<?php
    $datatableId = 'datatable_clients';

    $columnsMap = array(
        'id' => array(
            'name' => 'ID',
            'filter' => 'text',
            'width' => '5%',
        ),
        'name' => array(
            'name' => 'Name',
            'filter' => 'text',
            'width' => '25%',
        ),
        'phone' => array(
            'name' => 'Phone',
            'filter' => 'text',
            'width' => '15%',
        ),
        'created_at' => array(
            'name' => 'Created at',
            'filter' => 'date-range',
            'width' => '15%',
        ),
        'updated_at' => array(
            'name' => 'Updated at',
            'filter' => 'date-range',
            'width' => '15%',
        ),
        'actions' => array(
            'name' => 'Actions',
            'filter' => [], // ['btn_submit_search', 'btn_submit_reset'],
            'width' => '15%',
        ),
    );

    $table = Datatable::table()
            ->addColumn(array_pluck($columnsMap, 'name'))       // these are the column headings to be shown
            ->setOptions( array(
                        'tableTools' => array(
                            'sSwfPath' => asset('admin/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf'),
        //                    'aButtons' => array(
        //                            array('sExtends' => 'pdf', 'sButtonText' => 'PDF'),
        //                            array('sExtends' => 'csv', 'sButtonText' => 'CSV')
        //                    )
                        )
                )
            )
            ->setUrl(route('api.clients'))   // this is the route where data will be retrieved
            ->setId($datatableId);
?>

@section('datatables.column_filters')
    <tr class="filter">
        @foreach($columnsMap as $colName => $colOptions)
            <td align="center" valign="middle" class="head{{ $colName }}" width="{{ $colOptions['width'] }}">
                @if(!empty($colOptions['filter']))
                    @if(is_array($colOptions['filter']))
                        @foreach($colOptions['filter'] as $filterName)
                            @include('admin.datatables.elements.'.$filterName, ['id'=>$colName])
                        @endforeach
                    @elseif(is_string($colOptions['filter']))
                        @include('admin.datatables.elements.'.$colOptions['filter'], ['id'=>$colName])
                    @endif
                @endif
            </td>
        @endforeach
    </tr>
@stop

@section('content')
    <div class="portlet">

        <div class="portlet-title">
            <div class="caption">
                <i class="fa fa-shopping-cart"></i>Client Listing
            </div>
            <div class="actions">
                <a href="{{ route('admin.clients.create') }}" class="btn default yellow-stripe">
                    <i class="fa fa-plus"></i>
					<span class="hidden-480">New Client </span>
                </a>
            </div>
        </div>
        <div class="portlet-body">
            <div class="table-container">
                @include('admin.partials._datatables')
            </div>
        </div>

    </div>
@append

