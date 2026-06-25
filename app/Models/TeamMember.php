<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamMember extends Model
{
    protected $fillable = [
        'team_id', 'user_id', 'team_role_id', 'permissions', 'is_active', 'joined_at'
    ];

    protected function casts(): array
    {
        return [
            'permissions' => 'array',
            'is_active' => 'boolean',
            'joined_at' => 'datetime',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function teamRole(): BelongsTo
    {
        return $this->belongsTo(TeamRole::class);
    }

    public function hasPermission($permission)
    {
        if (!$this->permissions) {
            return false;
        }
        return in_array($permission, $this->permissions);
    }
}