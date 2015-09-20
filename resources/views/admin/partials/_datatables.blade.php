@section('style')
    <link href="/admin/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css" rel="stylesheet" type="text/css"/>
@stop

@section('scripts')
    <script src="/admin/global/plugins/datatables/media/js/jquery.dataTables.min.js" type="text/javascript"></script>
    <script src="/admin/global/plugins/datatables/extensions/TableTools/js/dataTables.tableTools.js" type="text/javascript"></script>
    <script src="/admin/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js" type="text/javascript"></script>
    <script src="/admin/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js" type="text/javascript"></script>
    <script src="/admin/global/scripts/datatable.js" type="text/javascript"></script>
@append

@include('admin.datatables.columns')

<div class="table-container">
    <table class="table table-striped table-bordered table-hover" id="{{ $id  }}">
        <thead>
            @yield('datatables.columns')
        </thead>
        <tbody></tbody>
    </table>
</div>

@include('admin.datatables.javascript', ['id'=>$id])