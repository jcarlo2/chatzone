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

  public function __construct()
  {
    $this->userService = app('userService');
  }


  public function showMain(): Response
  {
    error_log('hey');
    $user = Auth::user();
    $username = $user->username;
    return Inertia::render('Main', [
      'user' => [
        'id' => $user->id,
        'username' => $username,
        'firstName' => $user->firstName,
        'lastName' => $user->lastName
      ],
      'friends' => $this->userService->findAllFriends($username),
      'groups' => $this->userService->findAllGroups($username),
      'blocks' => $this->userService->findAllBlockedUser($username),
      'csrf' => csrf_token()
    ]);
  }

  public function findAllMessages()
  {
    return $this->userService->findAllMessages();
  }

  public function search()
  {
    return $this->userService->search();
  }

  public function updateFriendStatus()
  {
    return $this->userService->updateFriendStatus();
  }

  public function createGroup()
  {
    return $this->userService->createGroup();
  }

  public function showProfile()
  {
    return Inertia::render('ProfileModal', [
      'user' => Auth::user(),
      'friends' => $this->userService->findAllFriendsForProfile(Auth::user()->username),
      'blocks' => $this->userService->findAllBlockedUser(Auth::user()->username),
      'csrf' => csrf_token()
    ]);
  }

  public function profileUpdate()
  {
    $validate = validator([
      'firstName' => 'required',
      'lastName' => 'required',
      'email' => 'required|email|unique:users',
      'gender' => 'required',
    ]);
    $this->userService->profileUpdate();
    return to_route('main');
  }

  public function changePassword() {
    return Inertia::render('ChangePassword');
  }

  public function changePasswordPost() {
    request() -> validate([
      'password' => 'required|min:8|confirmed',
      'password_confirmation' => 'required'
    ]);
    User::query() 
    -> find(Auth::user() -> id)
    -> update([
      'password' => bcrypt(request('password'))
    ]);
    return to_route('profile');
  }
}
