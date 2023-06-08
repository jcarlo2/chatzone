<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

   private $message;
   private $channel;
   private $sender;
   private $fullName;
   private $initial;
   private $id;

    public function __construct($message, $channel, $sender, $initial, $fullName, $id)
    {
        $this -> message = $message;
        $this -> channel = $channel;
        $this -> sender = $sender;
        $this -> initial = $initial;
        $this -> fullName = $fullName;
        $this -> id = $id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('presence.play.' . $this -> channel),
        ];
    }

    public function broadcastAs(): string {
      return 'play-event';
    }

    public function broadcastWith(): array {
      return [
        'id' => $this -> id,
        'content' => $this -> message,
        'sender' => $this -> sender,
        'initial' => $this -> initial,
        'fullName' => $this -> fullName,
        'channel' => $this -> channel
      ];
    }
}
