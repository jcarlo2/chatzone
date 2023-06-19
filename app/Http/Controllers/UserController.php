<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Validated;
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
    return Inertia::render('Register');
  }

  public function store(RegisterRequest $request): RedirectResponse {
    $user = new User();
    $user -> username = $request -> username;
    $user -> password = bcrypt($request -> password);
    $user -> email = $request -> email;
    $user -> firstName = $request -> firstName;
    $user -> lastName = $request -> lastName;
    $user -> gender = $request -> gender;
    $user -> birthdate = $request -> birthdate;
    $user -> save();
    return redirect() -> intended('/login');
  }

  public function login(): Response {
    return Inertia::render('Login');
  }

  public function verify(): RedirectResponse {
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
    error_log('hey');
    $user = Auth::user();
    $username = $user -> username;
    return Inertia::render('Main',[
      'user' => [
        'id' => $user -> id, 
        'username' => $username,
        'firstName' => $user -> firstName, 
        'lastName' => $user -> lastName
      ],
      'friends' => $this -> userService -> findAllFriends($username),
      'groups' => $this -> userService -> findAllGroups($username),
      'blocks' => $this -> userService -> findAllBlockedUser($username),
      'csrf' => csrf_token()
    ]);
  }

  public function logout(): RedirectResponse {
    Auth::logout();
    return to_route('main');
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

  public function createGroup() {
    return $this -> userService -> createGroup();
  }

  public function showProfile() {
    return Inertia::render('ProfileModal', [
      'user' => Auth::user(),
      'friends' => $this -> userService -> findAllFriendsForProfile(Auth::user() -> username),
      'blocks' => $this -> userService -> findAllBlockedUser(Auth::user() -> username),
      'csrf' => csrf_token()
    ]);
  }
  
  public function profileUpdate() {
    $validate = validator([
      'firstName' => 'required',
      'lastName' => 'required',
      'email' => 'required|email|unique:users',
      'gender' => 'required',
    ]);
    $this -> userService -> profileUpdate();
    return to_route('main');
  }
}
