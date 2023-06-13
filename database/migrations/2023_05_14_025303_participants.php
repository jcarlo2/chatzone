<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('conversation_id');
            $table->string('username');
            $table->string('sender');
            $table->text('last_read_message') -> nullable(true);
            $table->tinyInteger('type') -> default(0);
            $table->timestamps();
            $table -> foreign('conversation_id') -> references('id') -> on('conversations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        Schema::dropIfExists('participants');
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
};
