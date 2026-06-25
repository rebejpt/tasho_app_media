<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Pour découvrir la plateforme',
                'storage_limit' => 10737418240, // 10GB
                'max_team_members' => 1,
                'max_projects' => 5,
                'has_advanced_features' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Pour les professionnels débutants',
                'storage_limit' => 107374182400, // 100GB
                'max_team_members' => 3,
                'max_projects' => 20,
                'has_advanced_features' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Pour les équipes en croissance',
                'storage_limit' => 1073741824000, // 1TB
                'max_team_members' => 10,
                'max_projects' => 50,
                'has_advanced_features' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Studio',
                'slug' => 'studio',
                'description' => 'Pour les grandes équipes',
                'storage_limit' => 10995116277760, // 10TB
                'max_team_members' => 50,
                'max_projects' => -1, // Illimité
                'has_advanced_features' => true,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}