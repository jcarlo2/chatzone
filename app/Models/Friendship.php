<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
  use HasFactory;
  public $timestamps = false;
  protected $fillable = [
    'conversation_id',
    'user_id',
    'friend_id',
    'status'
  ];
}
