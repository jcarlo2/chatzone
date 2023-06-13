<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participants extends Model
{
    use HasFactory;
    protected $fillable = [
        'conversation_id',
        'username',
        'last_read_message',
        'sender',
    ];
}
