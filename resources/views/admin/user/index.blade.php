@extends('admin.layouts.app')

<?php
    $table = Datatable::table()
            ->addColumn('id', 'Name', 'Created at', 'Updated at', 'Actions')       // these are the column headings to be shown
            ->setOptions( array(
                        'sDom' =>  "<'row' <'col-md-12'>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
                        'tableTools' => array(
                            'sSwfPath' => asset('admin/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf'),
        //                    'aButtons' => array(
        //                            array('sExtends' => 'pdf', 'sButtonText' => 'PDF'),
        //                            array('sExtends' => 'csv', 'sButtonText' => 'CSV')
        //                    )
                        )
                )
            )
            ->setUrl(route('api.users'));   // this is the route where data will be retrieved
?>

@include('admin.partials._datatables')


