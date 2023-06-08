<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('friendships', function (Blueprint $table) {
          $table -> id();
          $table -> string('conversation_id');
          $table -> string('user_id');
          $table -> string('friend_id');
          $table -> string('status');
          $table -> timestamp('created_at') -> useCurrent();

          $table -> foreign('conversation_id') -> references('id') -> on('conversations');
          $table -> foreign('user_id') -> references('username') -> on('users');
          $table -> foreign('friend_id') -> references('username') -> on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('friendship');
    }
};
