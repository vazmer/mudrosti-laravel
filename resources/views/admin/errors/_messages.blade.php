@if($errors->any())
    <ul class="alert alert-danger list-unstyled">
        @foreach($errors->all() as $err)
            <li>{{ $err }}</li>
        @endforeach
    </ul>
@endif