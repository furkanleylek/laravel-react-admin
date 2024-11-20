<?php

namespace App\Jobs;

use App\Models\Task;
use App\User;
use App\Notifications\TaskStartDateNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProcessScheduledTask implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Task instance
     *
     * @var App\Models\Task
     */
    protected $task;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $assignedUser = User::find($this->task->assigned_to);
            $createdByUser = User::find($this->task->user_id);
    
            collect([$assignedUser, $createdByUser])
                ->filter()
                ->unique('id')
                ->each(function ($user) {
                    $user->notify(new TaskStartDateNotification($this->task));
                });
        } catch (\Exception $e) {
            $this->fail($e);
        }
    }
}
