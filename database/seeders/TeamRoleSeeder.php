<?php

namespace Database\Seeders;

use App\Models\TeamRole;
use Illuminate\Database\Seeder;

class TeamRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Owner',
                'slug' => 'owner',
                'description' => 'Propriétaire de l\'équipe - tous les droits',
                'permissions' => ['*']
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Gère l\'équipe et les projets',
                'permissions' => ['view_files', 'download_files', 'upload_files', 'edit_projects', 'manage_members']
            ],
            [
                'name' => 'Editor',
                'slug' => 'editor',
                'description' => 'Peut modifier et uploader des fichiers',
                'permissions' => ['view_files', 'download_files', 'upload_files']
            ],
            [
                'name' => 'Viewer',
                'slug' => 'viewer',
                'description' => 'Peut seulement voir les fichiers',
                'permissions' => ['view_files']
            ],
        ];

        foreach ($roles as $role) {
            // Eviter les doublons lors d'un seed/reseed (unique sur name)
            TeamRole::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}