<x-mail::message>
<img src="{{ $message->embed(public_path() . '/images/logo.png') }}"/>
<x-mail::button :url="route('reset.password', $token)">
Reset Password
</x-mail::button>
</x-mail::message>
