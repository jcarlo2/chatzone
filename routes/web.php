<?php

use App\Events\PlayEvent;
use App\Http\Controllers\UserController;
use App\Http\Middleware\VerifyCsrfToken;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
  return redirect() -> intended('main');
}) -> middleware('auth');

Route::controller(UserController::class) -> group(function() {
  Route::get('/login','create') -> middleware('guest') -> name('login');
  Route::post('/login','store');
  Route::get('/main', 'showMain') -> middleware('auth') -> name('main');
  Route::get('/logout','logout') -> middleware('auth') -> name('logout');
  Route::post('/user/search','search') -> middleware('auth');
  Route::post('/user/update-friend-status','updateFriendStatus') -> middleware('auth');
});

Route::post('/event',function() {
  // validate first if user and channel exist

  $message = request('message');
  $channel = request('channel');
  $username = Auth::user() -> username;
  $initial = substr(Auth::user() -> firstName, 0, 1) . substr(Auth::user() -> lastName, 0 ,1);
  $fullName = Auth::user() -> firstName . ' ' . Auth::user() -> lastName;


  $entity = new Message();
  $entity -> username = $username;
  $entity -> message = $message;
  $entity -> conversation_id = $channel;
  $entity -> save();
  error_log($entity -> id);
  event(new PlayEvent($message, $channel, $username, $initial, $fullName, $entity -> id));
  return null;
});

