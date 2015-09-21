<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuotesCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quote_category', function (Blueprint $table) {
			$table->increments('id');
			$table->integer('quote_id')->unsigned()->index();
			$table->foreign('quote_id')
				->references('id')->on('quotes')
				->onDelete('cascade');
			$table->integer('category_id')->unsigned()->index();
			$table->foreign('category_id')
				->references('id')->on('categories')
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
        Schema::drop('quote_category');
    }
}
