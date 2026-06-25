<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Supprimer la colonne role_id et sa contrainte si elle existe.
            if (Schema::hasColumn('users', 'role_id')) {
                // Pour éviter les erreurs 1091 (FK introuvable), on supprime uniquement la colonne.
                // Laravel gérera les FK associées (ou l'ordre des migrations ne les a plus à ce stade).
                try {
                    $table->dropColumn('role_id');
                } catch (\Throwable $e) {
                    // ignore
                }
            }

            // Ajouter le rôle système
            if (!Schema::hasColumn('users', 'system_role')) {
                $table->enum('system_role', ['super_admin', 'professional'])->default('professional');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('system_role');
            $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
        });
    }
};