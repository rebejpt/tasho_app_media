<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Owner, Manager, Editor, Viewer
            $table->string('slug')->unique(); // owner, manager, editor, viewer
            $table->text('description')->nullable();
            $table->json('permissions')->nullable(); // Liste des permissions
            $table->timestamps();
        });

        // Insérer les rôles d'équipe par défaut
        DB::table('team_roles')->insert([
            ['name' => 'Owner', 'slug' => 'owner', 'description' => 'Propriétaire de l\'équipe', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Manager', 'slug' => 'manager', 'description' => 'Gère l\'équipe et les projets', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Editor', 'slug' => 'editor', 'description' => 'Peut modifier et uploader des fichiers', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Viewer', 'slug' => 'viewer', 'description' => 'Peut seulement voir', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('team_roles');
    }
};