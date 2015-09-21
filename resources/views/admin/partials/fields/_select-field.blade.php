@define $additionalOptions = isset($options) ? $options : [];
@define $selected = isset($selected) ? $selected : null;
<!--- {{ $label }} Field --->
<div class="form-group">
    {!! Form::label($id, $label.':') !!}
    {!! Form::select($id, ['' => ''] + $list, $selected, array_merge(['class' => 'form-control'], $additionalOptions)) !!}
</div>
