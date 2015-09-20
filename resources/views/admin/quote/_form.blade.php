@include('admin.partials.fields._text-field', ['id' => 'slug', 'label' => 'Slug'])

@include('admin.partials.fields._select-field', ['id' => 'author_id', 'label' => 'Author', 'options' => $authors])

@include('admin.partials.fields._select-field', ['id' => 'categories', 'label' => 'Categories', 'options' => $categories])

@include('admin.partials.fields._textarea-field', ['id' => 'text', 'label' => 'Text'])

@include('admin.partials.fields._submit-field', ['label' => $submitButtonText])