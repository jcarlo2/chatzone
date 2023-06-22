<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response as Res;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\PasswordResetToken;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{

  public function create(): Response
  {
    return Inertia::render('Register');
  }

  public function store(RegisterRequest $request): RedirectResponse
  {
    $user = new User();
    $user->username = $request->username;
    $user->password = bcrypt($request->password);
    $user->email = $request->email;
    $user->firstName = $request->firstName;
    $user->lastName = $request->lastName;
    $user->gender = $request->gender;
    $user->birthdate = $request->birthdate;
    $user->save();
    return redirect()->intended('/login');
  }

  public function login(): Response
  {
    return Inertia::render('Login');
  }

  public function verify(): RedirectResponse
  {
    $remember = request('remember_me');
    error_log($remember ? 'TRUE' : 'FALSE');

    $credentials = request()->validate([
      'username' => 'required',
      'password' => 'required|min:8'
    ]);


    if (Auth::attempt($credentials, request('remember_me'))) {
      request()->session()->regenerate();
      return redirect()->intended('main');
    }

    return back()->withErrors([
      'username' => 'Invalid username or password. Please check your credentials and try again.',
    ]);
  }
  
  public function logout(): RedirectResponse
  {
    Auth::logout();
    return to_route('main');
  }

  public function forgotPassword()
  {
    return Inertia::render('PasswordReset');
  }

  public function forgotPasswordPost()
  {
    $validated = request()->validate([
      'email' => 'required|email|exists:users'
    ]);

    $token = Str::random(64);

    $reset = PasswordResetToken::query()
      ->where('email', request('email'))
      ->first();

    if ($reset) {
      $reset->token = $token;
      $reset->created_at = Carbon::now();
      $reset->save();
    } else {
      PasswordResetToken::query()
        ->create([
          'email' => request('email'),
          'token' => $token,
          'created_at' => Carbon::now()
        ]);
    }

    Mail::send('reset-password', ['token' => $token], function ($message) {
      $message->to(request('email'));
      $message->subject('Reset Password');
    });

    return Inertia::render('PasswordReset', [
      'success' => 'Please check your email for instructions on how to reset your password.'
    ]);
  }

  function resetPassword($token)
  {
    $isExist = PasswordResetToken::query()->where('token', $token)->exists();
    if ($isExist) return view('change-password')->with(['token' => $token]);
    return response('Forbidden', Res::HTTP_FORBIDDEN);
  }

  function resetPasswordPost()
  {
    request()->validate([
      'email' => 'required|email|exists:users',
      'password' => 'required|min:8|confirmed',
      'password_confirmation' => 'required',
      'token' => 'required'
    ]);

    // delete reset token
    $reset = PasswordResetToken::query()
      ->where('token', request('token'))
      ->where('email', request('email'))
      ->first();
    // check and change password
    if ($reset) {
      $reset->delete();
      User::query()
        ->where('email', request('email'))
        ->update([
          'password' => bcrypt(request('password'))
        ]);
      return Inertia::render('Login', [
        'success' => 'Password changed successfully'
      ]);
    }
    return back()->with([
      'token' => request('token'),
    ]);
  }
}
