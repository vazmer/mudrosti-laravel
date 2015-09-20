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
        Schema::create('quotes_categories', function (Blueprint $table) {
			$table->increments('id');
			$table->integer('quote_id')->unsigned();
			$table->foreign('quote_id')
				->references('id')->on('quotes')
				->onDelete('cascade');
			$table->integer('category_id')->unsigned();
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
        Schema::drop('quotes_categories');
    }
}
