<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
  private $userService;

  public function __construct() {
    $this -> userService = app('userService');
  }

  public function create(): Response {
    return Inertia::render('Login');
  }

  public function store(): RedirectResponse {
    $credentials = request()->validate([
      'username' => ['required'],
      'password' => ['required', 'min:8'],
    ]);

    if (Auth::attempt($credentials)) {
      request() -> session() -> regenerate();
      return redirect() -> intended('main');
    }

    return back()->withErrors([
      'username' => 'Invalid username or password. Please check your credentials and try again.',
    ]);
  }

  public function showMain(): Response {
    $user = Auth::user();
    return Inertia::render('Main',[
      'user' => $user,
      'friends' => $this-> userService -> findAllFriends($user -> username),
      'csrf' => csrf_token()
    ]);
  }

  public function logout(): RedirectResponse {
    Auth::logout();
    return redirect() -> intended('login');
  }

  public function findAllMessages() {
    return $this -> userService -> findAllMessages();
  }

  public function search() {
    return $this -> userService -> search();
  }

  public function updateFriendStatus() {
    return $this -> userService -> updateFriendStatus();
  }
}
