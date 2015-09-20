@section('scripts')
<script type="text/javascript">
    jQuery(document).ready(function(){

        var TableAjax = function () {

            var initPickers = function () {
                //init date pickers
                $('.date-picker').datepicker({
                    rtl: Metronic.isRTL(),
                    autoclose: true,
                    format: 'yyyy/mm/dd'
                });
            }

            var handleRecords = function () {

                var grid = new Datatable();

                grid.init({
                    src: $("#{!! $id !!}"),
                    loadingMessage: 'Loading...',
                    dataTable: { // here you can define a typical datatable settings from http://datatables.net/usage/options
                        "lengthMenu": [
                            [10, 20, 50, 100, 150, -1],
                            [10, 20, 50, 100, 150, "All"] // change per page values here
                        ],
                        "pageLength": 10, // default record count per page
                        "ajax": {
                            "url": "{!! $url !!}", // ajax source
                            "type": "GET",
                            "data": function(data) { // add request parameters before submit
                                data['filters'] = grid.getAjaxParams();
                            }
                        },
                        "order": [
                            [0, "asc"]
                        ],// set first column as a default sort by asc
                        @yield('datatables.columns.javascript')
                    },
                });

            };

            return {

                //main function to initiate the module
                init: function () {
                    initPickers();
                    handleRecords();
                }

            };

        }();


        TableAjax.init();
    });
</script>
@append