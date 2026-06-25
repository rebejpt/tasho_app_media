<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'storage_limit',
        'max_team_members',
        'max_projects',
        'has_advanced_features',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'storage_limit' => 'integer',
            'max_team_members' => 'integer',
            'max_projects' => 'integer',
            'has_advanced_features' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}