<?php
if(!empty($columnsMap)) {
    foreach($columnsMap as $colName => $colOptions){
        if(!isset($colOptions['filters'])){
            $columnsMap[$colName]['filters'] = [$colName => 'text'];
        }

        if(!isset($colOptions['width'])){
            $columnsMap[$colName]['width'] = 100/count($columnsMap).'%';
        }

        if(!isset($colOptions['searchable'])){
            $columnsMap[$colName]['searchable'] = true;
        }
    }
}
?>

@section('datatables.columns')
    <tr role="row" class="heading">
        @foreach($columnsMap as $colName => $colOptions)
            <th width="{{ $colOptions['width'] }}">
                {{ $colOptions['label'] }}
            </th>
        @endforeach
    </tr>
    <tr class="filter">
        @foreach($columnsMap as $colName => $colOptions)
            <td align="{{ $colOptions['align'] or 'center' }}" width="{{ $colOptions['width'] }}">
                @if(!empty($colOptions['filters']))
                    @foreach($colOptions['filters'] as $filterName => $filterElement)
                        @if(is_array($filterElement))
                            @include('admin.datatables.elements.'.$filterElement['type'], ['id'=>$filterName, 'options'=>$filterElement['options']])
                        @else
                            @include('admin.datatables.elements.'.$filterElement, ['id'=>$filterName])
                        @endif
                    @endforeach
                @endif
            </td>
        @endforeach
    </tr>
@stop

@section('datatables.columns.javascript')
    "columns": [
        @foreach($columnsMap as $colName => $colOptions)
            {data: '{{ $colName }}', name: '{{ isset($colOptions['queryName']) ? $colOptions['queryName'] : $colName }}', searchable: {{ ($colOptions['searchable']) ? 'true' : 'false' }} },
        @endforeach
    ]
@stop