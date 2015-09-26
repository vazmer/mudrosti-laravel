<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImageCategoryQuoteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('image_category_quote', function (Blueprint $table) {
			$table->increments('id');
			$table->integer('quote_id')->unsigned()->index();
			$table->foreign('quote_id')
				->references('id')->on('quotes')
				->onDelete('cascade');
			$table->integer('image_category_id')->unsigned()->index();
			$table->foreign('image_category_id')
				->references('id')->on('image_categories')
				->onDelete('cascade');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('image_category_quote');
    }
}
