<?php $id = 'clients'; ?>
<?php $class = 'table table-hover table-condensed'; ?>

<table id="{{ $id }}" class="{{ $class }}">
    <colgroup>
        @for ($i = 0; $i < count($columns); $i++)
        <col class="con{{ $i }}" />
        @endfor
    </colgroup>
    <thead>
    <tr class="heading">
        @foreach($columns as $i => $c)
            <th align="center" valign="middle" class="head{{ $i }}">{{ $c }}</th>
        @endforeach
    </tr>
    @yield('datatables.column_filters')
    </thead>
    <tbody>
    @foreach($data as $d)
    <tr>
        @foreach($d as $dd)
        <td>{{ $dd }}</td>
        @endforeach
    </tr>
    @endforeach
    </tbody>
</table>

@if (!$noScript)
{{--    @include(Config::get('packages.chumper_datatable.table.script_view'), array('id' => $id, 'options' => $options, 'callbacks' =>  $callbacks))--}}
@endif