@extends('admin.layouts.app')

<?php
    $datatableId = 'datatable_clients';

    $columnsMap = array(
        'id' => array(
            'label' => 'ID',
            'filters' => ['id'=>'text'],
            'width' => '5%',
        ),
        'name' => array(
            'label' => 'Name',
            'filters' => ['name'=>'text'],
            'width' => '25%',
        ),
        'phone' => array(
            'label' => 'Phone',
            'filters' => ['phone'=>'text'],
            'width' => '15%',
        ),
        'created_at' => array(
            'label' => 'Created at',
            'filters' => ['created_at_from'=>'date-from', 'created_at_to' => 'date-to'],
            'width' => '15%',
        ),
        'updated_at' => array(
            'label' => 'Updated at',
            'filters' => ['updated_at_from'=>'date-from', 'updated_at_to' => 'date-to'],
            'width' => '15%',
        ),
        'actions' => array(
            'label' => 'Actions',
            'filters' => ['btn_submit_search', 'btn_submit_reset'],
            'width' => '10%',
            'align' => 'left',
        ),
    );

    $table = Datatable::table()
            ->addColumn(array_pluck($columnsMap, 'label'))       // these are the column headings to be shown
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
@include('admin.datatables.column-filters')

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

