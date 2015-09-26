@include('admin.partials.fields._text-field', ['id' => 'slug', 'label' => 'Slug'])

@include('admin.partials.fields._select-field', ['id' => 'author_id', 'label' => 'Author', 'list' => $authors])

@include('admin.partials.fields._select-field', ['id' => 'categories[]', 'label' => 'Categories', 'list' => $categories, 'options' => ['multiple'], 'selected' => isset($quote) ? $quote->categories->lists('id')->all() : null])

@include('admin.partials.fields._select-field', ['id' => 'categories_of_images[]', 'label' => 'Categories of Images', 'list' => $categoriesOfImages, 'options' => ['multiple'], 'selected' => isset($quote) ? $quote->categoriesOfImages->lists('id')->all() : null])

@include('admin.partials.fields._textarea-field', ['id' => 'text', 'label' => 'Text'])

@include('admin.partials.fields._submit-field', ['label' => $submitButtonText])