<?php
namespace App\Http\Service;

use App\Models\Conversation;
use App\Models\Friendship;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserService {
  public function findAllFriends($username): array {
    $friends = Friendship::query()
      ->where('user_id', $username)
      ->where('status', 'FRIEND')
      -> get();
    $friendList = array();
    $increment = 0;

    foreach ($friends as $friend) {
      $friendUsername = $username === $friend -> user_id
        ? $friend -> friend_id
        : $friend -> user_id;
      $friendEntity = User::query() -> where('username', $friendUsername) -> first();
      $conversation = Conversation::query() -> where('id',$friend -> conversation_id) -> first();
      $lastMessage = Message::query()
        -> where('conversation_id', $friend -> conversation_id)
        -> orderBy('created_at', 'desc')
        -> first();

      $friendList[$increment] = [
        'conversationId' => $friend->conversation_id,
        'username' => $friendUsername,
        'fullName' => $friendEntity -> firstName . ' ' . $friendEntity -> lastName,
        'status' => $friend->status,
        'lastMessage' => $lastMessage ? $lastMessage -> message : '',
        'isLastSender' => !$lastMessage || $friendUsername === $lastMessage->username,
        'type' => $conversation -> type
      ];
      $increment++;
    }
    return $friendList;
  }

  public function findAllMessages(): array {
    $messageList = Message::query()
      -> where('conversation_id',request('conversationId'))
      -> orderBy('created_at', 'desc')
      -> cursorPaginate(20);
    $list = array();
    $increment = 0;
    foreach($messageList as $message) {
      $user = User::query() -> where('username', $message -> username) -> first();
      $list[$increment] = [
        'id' => $message -> id,
        'username' => $message -> username,
        'fullName' => $user -> firstName . ' ' . $user -> lastName,
        'initial' => substr($user -> firstName,0,1) . substr($user -> lastName,0,1),
        'content' => $message -> message,
        'createdAt' => $message -> created_at,
        'conversationId' => request('conversationId')
      ];
      $increment++;
    }
    return [
      'url' => $messageList,
      'list' => array_reverse($list)
    ];
  }

  public function search(): array {
    $username = Auth::user() -> username;
    $search = request('search');
    $userList = User::query()
      -> whereNot('id', Auth::id())
      -> where(function($query) use ($search) {
        $query -> where('email', 'LIKE', "%{$search}%")
          -> orWhere('firstName', 'LIKE', "%{$search}%")
          -> orWhere('lastName', 'LIKE', "%{$search}%")
          -> orWhere('username', 'LIKE', "%{$search}%");
      }) -> get();

    $list = array();
    foreach ($userList as $user) {
      $friend = Friendship::query()
        -> where('user_id', $username)
        -> where('friend_id', $user -> username)
        -> first();
      $list[] = [
        'id' => $user -> id,
        'fullName' => "{$user -> firstName} {$user -> lastName}",
        'initial' => substr($user -> firstName, 0, 1) . substr($user -> lastName, 0, 1),
        'status' => !$friend || trim($friend -> status) === '' ? 'ADD' : $friend -> status,
      ];
    }
    return $list;
  }

  function updateFriendStatus(): array {
    // WEBSOCKET TO ENSURE REAL TIME UPDATE
    $status = request('status');
    $friendId = request('id');
    if($status === 'FRIEND') return ['status' => 'FRIEND'];

    $user = User::query() -> where('id',$friendId) -> first();

    $self = Friendship::query()
      -> where('user_id', Auth::user() -> username)
      -> where('friend_id', $user -> username)
      -> first();
    error_log($self);
    error_log(Auth::id());
    error_log($friendId);

    $stranger = Friendship::query()
      -> where('user_id', $user -> username)
      -> where('friend_id', Auth::user() -> username)
      -> first();

    if(!$self) {
      $conversation = new Conversation();
      $conversation -> type = 0;
      $conversation -> save();
      Friendship::query() -> create([
        'conversation_id' => $conversation -> id,
        'user_id' => Auth::user() -> username,
        'friend_id' => $user -> username,
        'status' => 'PENDING REQUEST'
      ]);
      Friendship::query() -> create([
        'conversation_id' => $conversation -> id,
        'user_id' => $user -> username,
        'friend_id' => Auth::user() -> username,
        'status' => 'PENDING APPROVED'
      ]);
      return ['status' => 'PENDING REQUEST'];
    }else if($status === 'PENDING' || $status === 'APPROVED?') {
      $self -> update(['status' => '', 'friendId' => $friendId]);
      $stranger -> update(['status' => '']);
      return ['status' => 'ADD', 'friendId' => $friendId];
    }
    $self -> update(['status' => 'PENDING REQUEST']);
    $stranger -> update(['status' => 'PENDING APPROVED']);

    return ['status' => 'PENDING REQUEST', 'friendId' => $friendId];
  }
}
