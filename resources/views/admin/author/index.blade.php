@extends('admin.layouts.app')

<?php
    $datatableId = 'datatable_authors';

    $columnsMap = array(
        'id' => array(
            'label' => 'ID',
            'width' => '5%',
            'queryName' => 'author.id',
        ),
        'name' => array(
            'label' => 'Name',
            'width' => '12%',
        ),
        'slug' => array(
            'label' => 'Slug',
        ),
        'about' => array(
            'label' => 'About',
        ),
        'created_at' => array(
            'label' => 'Created at',
            'filters' => ['created_at_from'=>'date-from', 'created_at_to' => 'date-to'],
            'searchable' => false,
        ),
        'updated_at' => array(
            'label' => 'Updated at',
            'filters' => ['updated_at_from'=>'date-from', 'updated_at_to' => 'date-to'],
            'searchable' => false,
        ),
        'deleted_at' => array(
            'label' => 'Deleted',
            'filters' => ['deleted' => ['type'=>'select', 'options'=> [''=>'All', 1=>'Active', -1=>'Deleted']]],
            'width' => '7%',
            'searchable' => false,
        ),
        'actions' => array(
            'label' => 'Actions',
            'filters' => ['btn_submit_search', 'btn_submit_reset'],
            'width' => '10%',
            'align' => 'left',
            'searchable' => false,
        ),
    );
?>

@section('content')
    <div class="portlet">
        <div class="portlet-title">
            <div class="caption">
                <i class="fa fa-shopping-cart"></i>Authors
            </div>
            <div class="actions">
                <a href="{{ route('admin.authors.create') }}" class="btn default yellow-stripe">
                    <i class="fa fa-plus"></i>
					<span class="hidden-480">New author</span>
                </a>
            </div>
        </div>
        <div class="portlet-body">
            <div class="table-container">
                @include('admin.partials._datatables', ['id'=>$datatableId, 'url'=>'api/authors'])
            </div>
        </div>
    </div>
@append

