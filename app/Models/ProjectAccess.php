<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectAccess extends Model
{
    protected $fillable = [
        'project_id',
        'client_id',
        'client_email',
        'access_token',
        'permissions',
        'is_active',
        'expires_at',
        'last_accessed_at',
    ];

    protected function casts(): array
    {
        return [
            'permissions' => 'array',
            'is_active' => 'boolean',
            'expires_at' => 'datetime',
            'last_accessed_at' => 'datetime',
        ];
    }

    public function project():BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}