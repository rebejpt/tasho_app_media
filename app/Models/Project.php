<?php

namespace App\Models;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $fillable = [
        'team_id', 'created_by', 'title', 'description', 
        'client_name', 'client_email', 'project_date', 'status',
        'allow_downloads', 'allow_comments', 'shared_at', 'share_token'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($project) {
            $project->share_token = Str::random(32);
        });
    }

    protected function casts(): array
    {
        return [
            'project_date' => 'date',
            'shared_at' => 'datetime',
            'allow_downloads' => 'boolean',
            'allow_comments' => 'boolean',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function createdBy():BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
                    ->withPivot('role_id', 'permissions')
                    ->withTimestamps();
    }

    public function folders(): HasMany
    {
        return $this->hasMany(Folder::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function accesses(): HasMany
    {
        return $this->hasMany(ProjectAccess::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function accessLogs(): HasMany
    {
        return $this->hasMany(AccessLog::class);
    }
}