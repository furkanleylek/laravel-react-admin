<?php

namespace App\Notifications;

use App\Models\Task;
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
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message' => "Task '{$this->task->title}' status changed from {$this->oldStatus} to {$this->newStatus}"
        ];
    }
}