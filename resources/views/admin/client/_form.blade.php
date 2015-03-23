<!--- First name Field --->
<div class="form-group">
    {!! Form::label('user[first_name]', 'First name:') !!}
    {!! Form::text('user[first_name]', null, ['class' => 'form-control']) !!}
</div>

<!--- Last name Field --->
<div class="form-group">
    {!! Form::label('user[last_name]', 'Last name:') !!}
    {!! Form::text('user[last_name]', null, ['class' => 'form-control']) !!}
</div>

<!--- Email Field --->
<div class="form-group">
    {!! Form::label('user[email]', 'Email:') !!}
    {!! Form::text('user[email]', null, ['class' => 'form-control']) !!}
</div>
    
<!--- Phone number Field --->
<div class="form-group">
    {!! Form::label('phone', 'Phone number:') !!}
    {!! Form::text('phone', null, ['class' => 'form-control']) !!}
</div>    

<!--- Password Field --->
<div class="form-group">
    {!! Form::label('user[password]', 'Password:') !!}
    {!! Form::password('user[password]', ['class' => 'form-control']) !!}
</div>

<!--- Repeat password Field --->
<div class="form-group">
    {!! Form::label('user[password_confirmation]', 'Repeat password:') !!}
    {!! Form::password('user[password_confirmation]', ['class' => 'form-control']) !!}
</div>

<!--- Submit user Field --->
<div class="form-group">
    {!! Form::submit($submitButtonText, ['class' => 'btn btn-primary']) !!}
</div>

