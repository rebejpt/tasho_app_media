<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('team_invitations')) {
            // Si la table n'existe pas encore, on la crée (idempotent).
            Schema::create('team_invitations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('team_id')->constrained()->cascadeOnDelete();
                $table->string('email');
                $table->string('token')->unique();
                $table->unsignedBigInteger('team_role_id')->nullable();
                $table->timestamp('expires_at');
                $table->timestamps();

                $table->unique(['team_id', 'email']);
            });
            return;
        }

        Schema::table('team_invitations', function (Blueprint $table) {
            if (Schema::hasColumn('team_invitations', 'role_id')) {
                $table->dropForeign(['role_id']);
                $table->dropColumn('role_id');
            }

            if (!Schema::hasColumn('team_invitations', 'team_role_id')) {
                $table->foreignId('team_role_id')->nullable()->constrained('team_roles')->nullOnDelete();
            }
        });
    }


    public function down(): void
    {
        Schema::table('team_invitations', function (Blueprint $table) {
            $table->dropForeign(['team_role_id']);
            $table->dropColumn('team_role_id');
            $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
        });
    }
};