<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Task;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
        $tasks = Task::with(['user', 'assignedUser'])->get();
        return response()->json($tasks);
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
    
        $task->load(['user', 'assignedUser']);
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
        $task->load(['user', 'assignedUser']);
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
    
        $task->load(['user', 'assignedUser']);
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
        // Önce deleted_by'ı güncelle
        $task->update([
            'deleted_by' => auth()->id()
        ]);
    
        // Sonra soft delete yap
        $task->delete();
    
        return response()->json(null, 204);
    }
}
