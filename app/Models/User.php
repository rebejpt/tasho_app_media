<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'phone', 'country', 'profession', 
        'work_type', 'storage_volume', 'password',
        'system_role', 'current_team_id', 'is_active'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // Relations
    public function currentTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'current_team_id');
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members')
                    ->withPivot('team_role_id', 'permissions', 'is_active')
                    ->withTimestamps();
    }

    public function ownedTeams(): HasMany
    {
        return $this->hasMany(Team::class, 'owner_id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class, 'uploaded_by');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function accessLogs(): HasMany
    {
        return $this->hasMany(AccessLog::class);
    }

    // Méthodes
    public function isSuperAdmin(): bool
    {
        return $this->system_role === 'super_admin';
    }

    public function isProfessional(): bool
    {
        return $this->system_role === 'professional';
    }

    public function getTeamRole($teamId)
    {
        $member = $this->teamMembers()->where('team_id', $teamId)->first();
        return $member ? $member->teamRole : null;
    }

    public function hasTeamRole($teamId, $roleSlug)
    {
        $role = $this->getTeamRole($teamId);
        return $role && $role->slug === $roleSlug;
    }

    public function isOwnerOfTeam($teamId)
    {
        return $this->hasTeamRole($teamId, 'owner');
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class);
    }
}