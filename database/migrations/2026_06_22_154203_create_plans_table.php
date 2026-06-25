<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Free, Starter, Pro, Studio
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->bigInteger('storage_limit')->default(1073741824); // 1GB en bytes
            $table->integer('max_team_members')->default(1);
            $table->integer('max_projects')->default(5);
            $table->boolean('has_advanced_features')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};