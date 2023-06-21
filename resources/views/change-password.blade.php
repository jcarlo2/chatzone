<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ChatZone: Reset Password</title>
    <link rel="stylesheet" href={{ asset('app.css') }}>
</head>

<body>
    <img src="/images/logo.png" alt="ChatZone">
   
    <form action={{ route('reset.password.post') }} method="POST">
        @csrf
        <input type="hidden" name="token" value="{{ $token }}">
        @error('email')
            <div class="invalid">{{ $message }}</div>
        @enderror
        <input type="email" name='email' placeholder="Email">
        @error('password')
            <div class="invalid">{{ $message }}</div>
        @enderror
        <input type="password" name='password' placeholder="New Password">
        @error('password_confirmation')
            <div class="invalid">{{ $message }}</div>
        @enderror
        <input type="password" name='password_confirmation' placeholder="Confirm Password">
        <input type="submit" value='Change Password'>
    </form>
</body>

</html>
