@section('scripts')
<script type="text/javascript">
    jQuery(document).ready(function(){
        // dynamic table

        /***
         Wrapper/Helper Class for datagrid based on jQuery Datatable Plugin
         ***/
        var Datatable = function() {

            var tableOptions; // main options
            var dataTable; // datatable object
            var table; // actual table jquery object
            var tableContainer; // actual table container object
            var tableWrapper; // actual table wrapper jquery object
            var tableInitialized = false;
            var ajaxParams = {}; // set filter mode
            var the;

            var countSelectedRecords = function() {
                var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
                var text = tableOptions.dataTable.language.metronicGroupActions;
                if (selected > 0) {
                    $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
                } else {
                    $('.table-group-actions > span', tableWrapper).text("");
                }
            };

            return {

                //main function to initiate the module
                init: function(options) {

                    if (!$().dataTable) {
                        return;
                    }

                    the = this;

                    // default settings
                    options = $.extend(true, {
                        src: '#{!! $id !!}', // actual table
                        filterApplyAction: "filter",
                        filterCancelAction: "filter_cancel",
                        resetGroupActionInputOnSuccess: true,
                        loadingMessage: 'Loading...',
                        dataTable: {
                            @foreach ($options as $k => $o)
                                    {!! json_encode($k) !!}: @if(!is_array($o)) @if(preg_match("/function/", $o)) {!! $o !!} @else {!! json_encode($o) !!}, @endif
                                @else
                                [{
                                @foreach ($o as $x => $r)
                                    {!! json_encode($x) !!}: @if(is_array($r)) {!! json_encode($r) !!}, @elseif(preg_match("/function/", $r)) {!! $r !!}, @else {!! json_encode($r) !!} @endif
                                @endforeach
                                        }],
                                @endif

                            @endforeach

                            @foreach ($callbacks as $k => $o)
                                {!! json_encode($k) !!}: {!! $o !!},
                            @endforeach
                            "dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r><'table-scrollable't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>", // datatable layout
//                            "pageLength": 10, // default records per page
                            "language": { // language settings
                                // metronic spesific
                                "metronicGroupActions": "_TOTAL_ records selected:  ",
                                "metronicAjaxRequestGeneralError": "Could not complete request. Please check your internet connection",

                                // data tables spesific
                                "lengthMenu": "<span class='seperator'>|</span>View _MENU_ records",
                                "info": "<span class='seperator'>|</span>Found total _TOTAL_ records",
                                "infoEmpty": "No records found to show",
                                "emptyTable": "No data available in table",
                                "zeroRecords": "No matching records found",
                                "paginate": {
                                    "previous": "Prev",
                                    "next": "Next",
                                    "last": "Last",
                                    "first": "First",
                                    "page": "Page",
                                    "pageOf": "of"
                                }
                            },

                            "orderCellsTop": true,
                            "pagingType": "bootstrap_extended", // pagination type(bootstrap, bootstrap_full_number or bootstrap_extended)
                            "autoWidth": false, // disable fixed width and enable fluid table

                            'fnServerParams': function ( aoData ) {
                                aoData.push( { "name": "more_data", "value": $('#order_date_from').val() } );
                            },

                            "drawCallback": function(oSettings) { // run some code on table redraw
                                if (tableInitialized === false) { // check if table has been initialized
                                    tableInitialized = true; // set table initialized
                                    table.show(); // display table
                                }
                                Metronic.initUniform($('input[type="checkbox"]', table)); // reinitialize uniform checkboxes on each table reload
                                countSelectedRecords(); // reset selected records indicator

                                // callback for ajax data load
                                if (tableOptions.onDataLoad) {
                                    tableOptions.onDataLoad.call(undefined, the);
                                }
                            }
                        }
                    }, options);

                    tableOptions = options;

                    // create table's jquery object
                    table = $(options.src);
                    tableContainer = table.parents(".table-container");

                    // apply the special class that used to restyle the default datatable
                    var tmp = $.fn.dataTableExt.oStdClasses;

                    $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
                    $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-small input-sm input-inline";
                    $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xsmall input-sm input-inline";

                    // initialize a datatable
                    dataTable = table.DataTable(options.dataTable);

                    // revert back to default
                    $.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
                    $.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
                    $.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;

                    // get table wrapper
                    tableWrapper = table.parents('.dataTables_wrapper');

                    // build table group actions panel
                    if ($('.table-actions-wrapper', tableContainer).size() === 1) {
                        $('.table-group-actions', tableWrapper).html($('.table-actions-wrapper', tableContainer).html()); // place the panel inside the wrapper
                        $('.table-actions-wrapper', tableContainer).remove(); // remove the template container
                    }
                    // handle group checkboxes check/uncheck
                    $('.group-checkable', table).change(function() {
                        var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table);
                        var checked = $(this).is(":checked");
                        $(set).each(function() {
                            $(this).attr("checked", checked);
                        });
                        $.uniform.update(set);
                        countSelectedRecords();
                    });

                    // handle row's checkbox click
                    table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function() {
                        countSelectedRecords();
                    });

                    // handle filter change
                    table.on('change', '.form-filter', function() {
                        the.submitFilter();
                    });

                    // handle filter submit button click
                    table.on('click', '.filter-submit', function(e) {
                        e.preventDefault();
                        the.submitFilter();
                    });

                    // handle filter cancel button click
                    table.on('click', '.filter-cancel', function(e) {
                        e.preventDefault();
                        the.resetFilter();
                    });
                },

                submitFilter: function() {
                    the.setAjaxParam("action", tableOptions.filterApplyAction);

                    // get all typeable inputs
                    $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', table).each(function() {
                        the.setAjaxParam($(this).attr("name"), $(this).val());
                    });

                    // get all checkboxes
                    $('input.form-filter[type="checkbox"]:checked', table).each(function() {
                        the.addAjaxParam($(this).attr("name"), $(this).val());
                    });

                    // get all radio buttons
                    $('input.form-filter[type="radio"]:checked', table).each(function() {
                        the.setAjaxParam($(this).attr("name"), $(this).val());
                    });

                    dataTable.ajax.reload();
                },

                resetFilter: function() {
                    $('textarea.form-filter, select.form-filter, input.form-filter', table).each(function() {
                        $(this).val("");
                    });
                    $('input.form-filter[type="checkbox"]', table).each(function() {
                        $(this).attr("checked", false);
                    });
                    the.clearAjaxParams();
                    the.addAjaxParam("action", tableOptions.filterCancelAction);
                    dataTable.ajax.reload();
                },

                getSelectedRowsCount: function() {
                    return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
                },

                getSelectedRows: function() {
                    var rows = [];
                    $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).each(function() {
                        rows.push($(this).val());
                    });

                    return rows;
                },

                setAjaxParam: function(name, value) {
                    ajaxParams[name] = value;
                },

                addAjaxParam: function(name, value) {
                    if (!ajaxParams[name]) {
                        ajaxParams[name] = [];
                    }

                    skip = false;
                    for (var i = 0; i < (ajaxParams[name]).length; i++) { // check for duplicates
                        if (ajaxParams[name][i] === value) {
                            skip = true;
                        }
                    }

                    if (skip === false) {
                        ajaxParams[name].push(value);
                    }
                },

                clearAjaxParams: function(name, value) {
                    ajaxParams = {};
                },

                getDataTable: function() {
                    return dataTable;
                },

                getTableWrapper: function() {
                    return tableWrapper;
                },

                gettableContainer: function() {
                    return tableContainer;
                },

                getTable: function() {
                    return table;
                }

            };

        };

        var grid = new Datatable();
    grid.init();

        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        });
    });
</script>

@append