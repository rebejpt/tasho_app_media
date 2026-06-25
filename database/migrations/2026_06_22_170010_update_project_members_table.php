// database/migrations/xxxx_xx_xx_update_project_members_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_members', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
            
            $table->foreignId('team_role_id')->nullable()->constrained('team_roles')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('project_members', function (Blueprint $table) {
            $table->dropForeign(['team_role_id']);
            $table->dropColumn('team_role_id');
            $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
        });
    }
};