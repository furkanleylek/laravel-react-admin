<?php

namespace App\Notifications;

use App\Models\Task;
use App\Events\NewNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskStartDateNotification extends Notification
{
    use Queueable;

    protected $task;

   
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

   
    public function via($notifiable)
    {
        return ['database']; 
    }
   
    public function toArray($notifiable)

    {
        $message = "Task '{$this->task->title}' start time has arrived .";

        $notificationData = [
            'task' => $this->task,
            'message' => $message
        ];

        event(new NewNotification($notificationData));

        return $notificationData;

    }
}
