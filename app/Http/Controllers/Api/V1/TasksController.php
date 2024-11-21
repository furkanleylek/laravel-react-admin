<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Task;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Notifications\TaskStatusChanged;
use App\User;
use App\Jobs\ProcessScheduledTask;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
/*
public function index()   // GET    /tasks      (Liste)
public function store()   // POST   /tasks      (Oluştur)
public function show()    // GET    /tasks/{id} (Tek kayıt)
public function update()  // PUT    /tasks/{id} (Güncelle)
public function destroy() // DELETE /tasks/{id} (Sil)
*/

class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $userId = auth()->id();
        $cacheKey = "tasks_user_{$userId}";

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($userId) {
            return Task::query()
                ->select(['id', 'title', 'description', 'status', 'user_id','start_date', 'assigned_to', 'created_at'])
                ->with(['user:id,name,username,email', 'assignedUser:id,name,username,email'])
                ->where(function ($query) use ($userId) {
                    $query->where('user_id', $userId)
                          ->orWhere('assigned_to', $userId);
                })
                ->orderBy('created_at', 'desc')
                ->get();
        });
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,inprogress,done',
            'assigned_to' => 'nullable|exists:users,id',
            'start_date' => 'required|date',
        ]);
    
        $task = Task::create(array_merge($validated, [
            'user_id' => auth()->id(),
            'created_by' => auth()->id()
        ]));
    
        if ($task->start_date) {
            $startDate = Carbon::parse($task->start_date, 'Europe/Istanbul')
                ->setTimezone('UTC');  // UTC'ye çevir
            
            ProcessScheduledTask::dispatch($task)
                ->delay($startDate);
        }

        $task = Task::query()
            ->with(['user:id,name,username,email', 'assignedUser:id,name,username,email'])
            ->find($task->id);

        // Yeni task oluşturulduğunda cache'i temizle
        Cache::forget("tasks_user_{$task->user_id}");
        if ($task->assigned_to) {
            Cache::forget("tasks_user_{$task->assigned_to}");
        }

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        $task->load(['user:id,name,username,email', 'assignedUser:id,name,username,email']);
        return response()->json($task);
    }
   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        $oldAssignedTo = $task->assigned_to;
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|in:todo,inprogress,done',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
            'start_date' => 'sometimes|required|date'
        ]); 
    
        $task->update(array_merge($validated, [
            'updated_by' => auth()->id()
        ]));
    
        if ($task->wasChanged('start_date') && $task->start_date) {
            $startDate = Carbon::parse($task->start_date, 'Europe/Istanbul')
                ->setTimezone('UTC');  // UTC'ye çevir
            
            ProcessScheduledTask::dispatch($task)
                ->delay($startDate);
        }
    
        $task->load(['user:id,name,username,email', 'assignedUser:id,name,username,email']);

        // Cache'i temizle
        Cache::forget("tasks_user_{$task->user_id}");
        if ($oldAssignedTo) {
            Cache::forget("tasks_user_{$oldAssignedTo}");
        }
        if ($task->assigned_to) {
            Cache::forget("tasks_user_{$task->assigned_to}");
        }

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        // Cache'i temizle
        Cache::forget("tasks_user_{$task->user_id}");
        if ($task->assigned_to) {
            Cache::forget("tasks_user_{$task->assigned_to}");
        }

        // Önce deleted_by'ı güncelle
        $task->update([
            'deleted_by' => auth()->id()
        ]);
    
        // Sonra soft delete yap
        $task->delete();
    
        return response()->json(null, 204);
    }

    public function notifyTaskStatusChange(Request $request, Task $task)
    {
        try {
            $oldStatus = $task->status;
            $newStatus = $request->status;

            $task->update([
                'status' => $newStatus
            ]);

            $assignedUser = User::find($task->assigned_to);
            $createdByUser = User::find($task->user_id);

            $usersToNotify = collect([$assignedUser, $createdByUser])
                ->filter()
                ->unique('id')
                ->each(function ($user) use ($task, $oldStatus, $newStatus) {
                    $user->notify(new TaskStatusChanged($task, $oldStatus, $newStatus));
                });

            // Status değiştiğinde cache'i temizle
            Cache::forget("tasks_user_{$task->user_id}");
            if ($task->assigned_to) {
                Cache::forget("tasks_user_{$task->assigned_to}");
            }

            return response()->json([
                'message' => 'Task status updated successfully',
                'task' => $task,
                'notifications_sent' => $usersToNotify->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update task status',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
