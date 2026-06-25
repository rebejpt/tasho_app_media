<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Cette migration doit pouvoir s'exécuter même si elle arrive avant la création initiale.
        // Si la table n'existe pas, on la crée directement.
        if (!Schema::hasTable('team_members')) {
            Schema::create('team_members', function (Blueprint $table) {
                $table->id();
                $table->foreignId('team_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->unsignedBigInteger('team_role_id')->nullable();
                $table->json('permissions')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamp('joined_at')->useCurrent();
                $table->timestamps();

                $table->unique(['team_id', 'user_id']);
            });

            return;
        }

        Schema::table('team_members', function (Blueprint $table) {
            // Ancienne colonne role_id peut ne pas exister selon l'ordre des migrations.
            if (Schema::hasColumn('team_members', 'role_id')) {
                $table->dropForeign(['role_id']);
                $table->dropColumn('role_id');
            }

            // Ajouter la nouvelle colonne team_role_id si elle n'existe pas
            if (!Schema::hasColumn('team_members', 'team_role_id')) {
                $table->foreignId('team_role_id')->nullable()->constrained('team_roles')->nullOnDelete();
            }
        });
    }


    public function down(): void
    {
        Schema::table('team_members', function (Blueprint $table) {
            if (Schema::hasColumn('team_members', 'team_role_id')) {
                $table->dropForeign(['team_role_id']);
                $table->dropColumn('team_role_id');
            }

            if (!Schema::hasColumn('team_members', 'role_id')) {
                $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
            }
        });
    }
};