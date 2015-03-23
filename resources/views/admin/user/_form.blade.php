<!--- Avatar Field --->
<div class="form-group">
    <div class="fileinput fileinput-new" data-provides="fileinput">
        <div class="fileinput-new thumbnail" style="width: 200px; height: 150px;">
            @if($avatar)
                <img src="{{ url($avatar->file_path) }}" alt=""/>
            @else
                <img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image" alt=""/>
            @endif
        </div>
        <div class="fileinput-preview fileinput-exists thumbnail" style="max-width: 200px; max-height: 150px;">
        </div>
        <div>
																<span class="btn default btn-file">
																<span class="fileinput-new">
																Select image </span>
																<span class="fileinput-exists">
																Change </span>
																{!! Form::file('avatar') !!}
																</span>
            <a href="#" class="btn default fileinput-exists" data-dismiss="fileinput">
                Remove </a>
        </div>
    </div>
</div>

{!! Form::hidden('media_ids', json_encode($user->media()->lists('id'))) !!}

@section('css-plugins')
    {!! Html::style('/admin/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css') !!}
@append

@section('js-plugins')
    {!! \Html::script('/admin/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js') !!}
@append

<!--- First name Field --->
<div class="form-group">
    {!! Form::label('first_name', 'First name:') !!}
    {!! Form::text('first_name', null, ['class' => 'form-control']) !!}
</div>

<!--- Last name Field --->
<div class="form-group">
    {!! Form::label('last_name', 'Last name:') !!}
    {!! Form::text('last_name', null, ['class' => 'form-control']) !!}
</div>

<!--- Email Field --->
<div class="form-group">
    {!! Form::label('email', 'Email:') !!}
    {!! Form::text('email', null, ['class' => 'form-control']) !!}
</div>

<!--- Password Field --->
<div class="form-group">
    {!! Form::label('password', 'Password:') !!}
    {!! Form::password('password', ['class' => 'form-control']) !!}
</div>

<!--- Repeat password Field --->
<div class="form-group">
    {!! Form::label('password_confirmation', 'Repeat password:') !!}
    {!! Form::password('password_confirmation', ['class' => 'form-control']) !!}
</div>

<!--- Submit user Field --->
<div class="form-group">
    {!! Form::submit($submitButtonText, ['class' => 'btn btn-primary']) !!}
</div>

