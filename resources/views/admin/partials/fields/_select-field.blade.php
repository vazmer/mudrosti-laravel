<!--- {{ $label }} Field --->
<div class="form-group">
    {!! Form::label($id, $label.':') !!}
    {!! Form::select($id, $options, null, ['class' => 'form-control']) !!}
</div>
