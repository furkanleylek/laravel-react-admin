<?php

namespace App\Notifications;

use App\Models\Task;
use App\Events\NewNotification;

use Illuminate\Notifications\Notification;

class TaskStatusChanged extends Notification
{
    protected $task;
    protected $oldStatus;
    protected $newStatus;

    public function __construct(Task $task, $oldStatus, $newStatus)
    {
        $this->task = $task;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    public function via($notifiable)
    {
        return ['database']; 
    }

    public function toArray($notifiable)
    {

        $message = ($this->oldStatus === $this->newStatus) 
            ? "Task '{$this->task->title}' position changed" 
            : "Task '{$this->task->title}' status changed from {$this->oldStatus} to {$this->newStatus}";

        $notificationData = [
            'task' => $this->task,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message' => $message
        ];
       
        event(new NewNotification($notificationData));

        return $notificationData;

    }
}