<?php

use App\Events\PlayEvent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Models\Friendship;
use App\Models\Message;
use App\Models\Participants;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
  return to_route('main');
})->middleware('auth');

Route::controller(AuthController::class)->group(function () {
  Route::get('/reset-password/{token}', 'resetPassword') -> name('reset.password');
  Route::post('/reset-password}', 'resetPasswordPost') -> name('reset.password.post');
  Route::get('/forgot-password', 'forgotPassword')->middleware('guest');
  Route::post('/forgot-password', 'forgotPasswordPost')->middleware('guest');
  Route::get('/register', 'create')->middleware('guest');
  Route::post('/register', 'store');
  Route::get('/login', 'login')->middleware('guest')->name('login');
  Route::post('/login', 'verify');
  Route::get('/logout', 'logout')->middleware('auth')->name('logout');
});

Route::controller(UserController::class)->group(function () {
  Route::get('/main', 'showMain')->middleware('auth')->name('main');
  Route::post('/user/search', 'search')->middleware('auth');
  Route::post('/user/update-friend-status', 'updateFriendStatus')->middleware('auth');
  Route::post('/user/create-group', 'createGroup')->middleware('auth');
  Route::post('/user/profile-update', 'profileUpdate')->middleware('auth');
  Route::get('/profile', 'showProfile')->middleware('auth');
});

Route::post('/event', function () {
  // validate first if user and channel exist
  if (!Auth::check()) return ['response' => 'Unauthorized'];
  $username = Auth::user()->username;
  $initial = substr(Auth::user()->firstName, 0, 1) . substr(Auth::user()->lastName, 0, 1);
  $fullName = Auth::user()->firstName . ' ' . Auth::user()->lastName;

  $friendUsername = request('username');
  $message = request('message');
  $channel = request('channel');

  $isFriend = Friendship::query()
    ->where('user_id', Auth::user()->username)
    ->where('friend_id', $friendUsername)
    ->where('status', 'Friend')
    ->exists();

  $isGroup = Participants::query()
    ->where('conversation_id', $channel)
    ->where('username', Auth::user()->username)
    ->exists();

  if ($isFriend) {
    $entity = new Message();
    $entity->username = $username;
    $entity->message = $message;
    $entity->conversation_id = $channel;
    $entity->save();
    event(new PlayEvent($message, $channel, $username, $initial, $fullName, $entity->id));
    return ['response' => 'Success'];
  } else if ($isGroup) {
    $entity = new Message();
    $entity->username = $username;
    $entity->message = $message;
    $entity->conversation_id = $channel;
    $entity->save();
    event(new PlayEvent($message, $channel, $username, $initial, $fullName, $entity->id));
    return ['response' => 'Success'];
  }
  return ['status' => '', 'friendUsername' => $friendUsername];
})->middleware('auth');
