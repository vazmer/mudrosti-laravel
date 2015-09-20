<select class="form-control form-filter input-sm" name="{{ $id }}" id="{{ $id }}">
    @foreach($options as $oVal => $oLabel)
        <option value="{{ $oVal }}">{{ $oLabel }}</option>
    @endforeach    
</select>

