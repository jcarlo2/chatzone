<?php

use App\Models\Friendship;
use App\Models\Participants;
use Illuminate\Support\Facades\Broadcast;

//Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//    return (int) $user->id === (int) $id;
//});

Broadcast::channel('private.play.{id}', function ($user, $id) {
  return Friendship::query() -> where('conversation_id', $id) -> exists();
});

Broadcast::channel('presence.play.{id}', function ($user, $id) {
//  $exist = Participants::query() -> where('conversation_id', $id) -> exists();
  $exist = Friendship::query() -> where('conversation_id', $id) -> exists();
  error_log('hey');
  error_log($id);
  error_log($user);
  return $exist ? $user : false;
});
