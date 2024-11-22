<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewNotification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;

    public function __construct($notification)
    {
        $this->notification = $notification;
    }


    public function broadcastOn()
    {
        $assignedTo = $this->notification['task']['assigned_to'];
        $createdBy = $this->notification['task']['user_id'];
        
        // Eğer task'ı oluşturan ve atanan kişi aynıysa
        if ($assignedTo === $createdBy) {
            return new Channel('task-notifications-channel.' . $assignedTo);
        }
        
        // Farklı kişilerse her ikisine de gönder
        return [
            new Channel('task-notifications-channel.' . $assignedTo),
            new Channel('task-notifications-channel.' . $createdBy)
        ];
    }

    public function broadcastWith()
    {
        return [
            'data' => $this->notification
        ] ;
    }

    public function broadcastAs()
    {
        return 'notification-created';
    }
}