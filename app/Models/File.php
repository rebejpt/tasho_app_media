<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    protected $fillable = [
        'project_id', 'folder_id', 'uploaded_by',
        'name', 'original_name', 'path', 'mime_type',
        'extension', 'size', 'metadata', 'is_public'
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'is_public' => 'boolean',
            'size' => 'integer',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}