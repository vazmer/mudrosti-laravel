@section('datatables.column_filters')
    <tr class="filter">
        @foreach($columnsMap as $colName => $colOptions)
            <td align="{{ $colOptions['align'] or 'center' }}" width="{{ $colOptions['width'] }}">
                @if(!empty($colOptions['filters']))
                    @foreach($colOptions['filters'] as $filterName => $filterType)
                        @include('admin.datatables.elements.'.$filterType, ['id'=>$filterName])
                    @endforeach
                @endif
            </td>
        @endforeach
    </tr>

    <?php
        $paramsData = '';
        $filters = array_pluck($columnsMap, 'filters');
        if(!empty($filters))
        {
            foreach($filters as $filter)
            {
                foreach($filter as $fName => $fType)
                {
                    $paramsData .= 'aoData.push( { "name": "filters['.$fName.']", "value": $("#'.$fName.'").val() } );';
                }
            }
        }
    ?>

    <?php
        $table->setCallbacks(
            'fnServerParams', 'function ( aoData ) {'.$paramsData.'}'
        )
    ?>
@stop