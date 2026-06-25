<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ajouter chaque colonne uniquement si elle n'existe pas déjà.
        if (! Schema::hasColumn('users', 'phone')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone')->nullable();
            });
        }

        if (! Schema::hasColumn('users', 'country')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('country')->nullable();
            });
        }

        if (! Schema::hasColumn('users', 'profession')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('profession')->nullable();
            });
        }

        if (! Schema::hasColumn('users', 'work_type')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('work_type')->nullable();
            });
        }

        if (! Schema::hasColumn('users', 'storage_volume')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('storage_volume')->nullable();
            });
        }

        if (! Schema::hasColumn('users', 'role_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unsignedBigInteger('role_id')->nullable();
            });
        }

        if (! Schema::hasColumn('users', 'current_team_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unsignedBigInteger('current_team_id')->nullable();
            });
        }

        if (! Schema::hasColumn('users', 'is_active')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_active')->default(true);
            });
        }

        if (! Schema::hasColumn('users', 'last_active_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->timestamp('last_active_at')->nullable();
            });
        }
    }

    public function down(): void
    {
        // Supprimer chaque colonne uniquement si elle existe.
        $columns = [
            'phone',
            'country',
            'profession',
            'work_type',
            'storage_volume',
            'is_active',
            'last_active_at',
            'role_id',
            'current_team_id',
        ];

        foreach ($columns as $col) {
            if (Schema::hasColumn('users', $col)) {
                Schema::table('users', function (Blueprint $table) use ($col) {
                    try {
                        $table->dropColumn($col);
                    } catch (\Throwable $e) {
                        // ignore errors during drop (safe rollback)
                    }
                });
            }
        }
    }
};