<?php

use App\Models\Friendship;
use App\Models\Participants;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

//Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//    return (int) $user->id === (int) $id;
//});

Broadcast::channel('private.play.{id}', function ($user, $id) {
  return Friendship::query() -> where('conversation_id', $id) -> exists();
});

Broadcast::channel('presence.play.{id}', function ($user, $id) {
//  $exist = Participants::query() -> where('conversation_id', $id) -> exists();
 if(Auth::check()) {
   $friendExist = Friendship::query() -> where('conversation_id', $id) -> exists();
   $groupExist = Participants::query() -> where('conversation_id', $id) -> exists();
   return $friendExist || $groupExist
     ? ['id' => $user -> id, 'name' => $user -> firstName . ' ' . $user -> lastName]
     : false;
 }
 return false;
});
