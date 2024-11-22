<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;  

    protected $guarded = [];  

    protected $fillable = [
        'user_id',        // taski oluşturan kullanıcı
        'assigned_to',    // taski atayan kullanıcı
        'title',          // task başlığı
        'description',    // task açıklaması
        'status',         // task durumu (todo, inprogress, done)
        'start_date',     // baslangic tarihi
        'created_by',     // olusturan
        'updated_by'      // guncelleyen
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}