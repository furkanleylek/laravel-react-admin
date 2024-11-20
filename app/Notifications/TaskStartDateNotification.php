<?php

namespace App\Notifications;

use App\Models\Task;
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
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'start_date' => $this->task->start_date,
            'message' => "Task '{$this->task->title}' start date has arrived !"
        ];
    }
}
