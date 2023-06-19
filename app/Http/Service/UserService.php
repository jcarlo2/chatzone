<?php
namespace App\Http\Service;

use App\Models\Conversation;
use App\Models\Friendship;
use App\Models\Message;
use App\Models\Participants;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserService {
  public function findAllFriends($username): array {
    $friends = Friendship::query()
      ->where('user_id', $username)
      ->where('status', 'Friend')
      -> get();
    $friendList = $this -> setFriendList($friends, $username);
    return $friendList;
  }

  public function findAllFriendsForProfile($username): array {
    $friends = Friendship::query()
      ->where('user_id', $username)
      ->whereIn('status', ['Friend','Pending Request', 'Pending Approved'])
      -> get(); 
    $friendList = $this -> setFriendList($friends, $username);
    return $friendList;
  }

  private function setFriendList($friends, $username) {
    $friendList = array();
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

      $friendList[] = [
        'conversationId' => $friend->conversation_id,
        'username' => $friendUsername,
        'id' => $friendEntity -> id,
        'fullName' => $friendEntity -> firstName . ' ' . $friendEntity -> lastName,
        'initial' => substr($friendEntity -> firstName, 0, 1) . substr($friendEntity -> lastName, 0, 1),
        'status' => $friend->status,
        'lastMessage' => $lastMessage !== null ? $lastMessage -> message : '',
        'isLastSender' => $lastMessage === null ? false : Auth::user() -> username === $lastMessage -> username,
        'type' => $conversation -> type
      ];
    }
    return $friendList;
  }

  public function findAllGroups($username): array {
    $groups = Participants::query()
      -> where('username', $username)
      -> orderBy('updated_at')
      -> get();
    $list = array();
    foreach($groups as $group) {
      $conversation = Conversation::query()
        -> where('id', $group -> conversation_id)
        -> first();
      $lastMessage = Message::query()
        -> where('conversation_id', $group -> conversation_id)
        -> orderBy('created_at', 'desc')
        -> first();

      $list[] = [
        'conversationId' => $group -> conversation_id,
        'lastMessage' => $lastMessage === null ? '' : $lastMessage -> message,
        'messageType' => $group -> type,
        'isLastSender' => $lastMessage === null ? false : Auth::user() -> username === $lastMessage -> username,
        'type' => $conversation -> type,
        'fullName' => $conversation -> name
      ];
    }
    return $list;
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

  public function findAllBlockedUser() {
    $blockList = Friendship::query()
        -> where('user_id', Auth::user() -> username)
        -> where('status', 'Blocked 0')
        -> get();

    $list = array();
    foreach($blockList as $block) {
        $user = User::query() 
            -> where('username', $block -> friend_id)
            -> first();
        $list[] = [
            'id' => $block -> id,
            'conversationId' => $block -> conversation_id,
            'friendId' => $block -> friend_id,
            'fullName' => $user -> firstName . ' ' . $user -> lastName,
            'initial' => substr($user -> firstName, 0, 1) . substr($user -> lastName, 0, 1),
        ];
    }
    return $list;
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
      if(!$friend) {
        $list[] = [
          'id' => $user -> id,
          'fullName' => "{$user -> firstName} {$user -> lastName}",
          'initial' => substr($user -> firstName, 0, 1) . substr($user -> lastName, 0, 1),
          'status' => 'Add'
        ];
      }
      else if($friend -> status !== 'Blocked 0' && $friend -> status !== 'Blocked 1') {
        $list[] = [
          'id' => $user -> id,
          'fullName' => "{$user -> firstName} {$user -> lastName}",
          'initial' => substr($user -> firstName, 0, 1) . substr($user -> lastName, 0, 1),
          'status' => trim($friend -> status) === '' ? 'Add' : $friend -> status,
        ];
      }
    }
    return $list;
  }

  function updateFriendStatus(): array {
    $status = request('status');
    $friendId = request('id');

    $user = User::query() -> where('id',$friendId) -> first();

    $self = Friendship::query()
      -> where('user_id', Auth::user() -> username)
      -> where('friend_id', $user -> username)
      -> first();

    $stranger = Friendship::query()
      -> where('user_id', $user -> username)
      -> where('friend_id', Auth::user() -> username)
      -> first();

    $updateStatus = '';

    if(!$self && $status === 'Add') {
      $conversation = new Conversation();
      $conversation-> type = 0;
      $conversation->save();
      Friendship::query()->create([
        'conversation_id' => $conversation->id,
        'user_id' => Auth::user()->username,
        'friend_id' => $user->username,
        'status' => 'Pending Request'
      ]);
      Friendship::query()->create([
        'conversation_id' => $conversation->id,
        'user_id' => $user->username,
        'friend_id' => Auth::user()->username,
        'status' => 'Pending Approved'
      ]);
      return ['status' => 'Pending', 'friendId' => $friendId];
    }
    else if($status === 'Add') {
      $self -> update(['status' => 'Pending Request']);
      $stranger -> update(['status' => 'Pending Approved']);
      return ['status' => 'Pending', 'friendId' => $friendId];
    }
    else if($status === 'Block') {
      $self -> update(['status' => 'Blocked 0']);
      $stranger -> update(['status' => 'Blocked 1']);
      return ['status' => 'Blocked', 'friendId' => $friendId];
    }
    else if($status === 'Accept') $updateStatus = 'Friend';

    $self -> update(['status' => $updateStatus]);
    $stranger -> update(['status' => $updateStatus]);
    return ['status' => $updateStatus === '' ? 'Add' : 'Friend', 'friendId' => $friendId];
  }

  public function createGroup() {
    $conversation = new Conversation();
    $conversation -> type = 1;
    $conversation -> name = request('name');
    $conversation -> save();

    $members = request('members');
    $this -> createParticipant(Auth::user() -> username, $conversation -> id);
    foreach(json_decode($members) as $member) {
      $this -> createParticipant($member -> username, $conversation -> id);
    }

    return redirect() -> to('main');
  }

  function createParticipant($username, $conversationId) {
    $participants = new Participants();
    $participants -> conversation_id = $conversationId;
    $participants -> username = $username;
    $participants -> last_read_message = '';
    $participants -> sender = '';
    $participants -> save();
  }

  function profileUpdate() {
    $username = request('username');
    if(Auth::user() -> username === $username) {
      $user = User::query() -> where('username', $username) -> first();
      $user -> firstName = request('firstName');
      $user -> lastName = request('lastName');
      $user -> email = request('email');
      $user -> gender = request('gender');
      $user -> save();
    }
  }
}
