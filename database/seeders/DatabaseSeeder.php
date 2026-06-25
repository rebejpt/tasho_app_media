<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\TeamRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Appeler les seeders pour les données de base
        $this->call([
            TeamRoleSeeder::class,
            // PlanSeeder casse car le modèle App\Models\Plan n'existe pas
            // (Plan est absent de app/Models). On le désactive pour que le seed global marche.
            // PlanSeeder::class,
        ]);

        // Créer le Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@tasho.app',
            'phone' => '+1234567890',
            'country' => 'France',
            'password' => Hash::make('password'),
            'system_role' => 'super_admin',
            'is_active' => true,
        ]);

        // Créer un professionnel test
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+0987654321',
            'country' => 'France',
            'profession' => 'Photographe',
            'work_type' => 'seul',
            'storage_volume' => '10GB-100GB',
            'password' => Hash::make('password'),
            'system_role' => 'professional',
            'is_active' => true,
        ]);

        // Créer une équipe pour John
        $team = Team::create([
            'owner_id' => $user->id,
            'name' => 'Studio John Doe',
            'slug' => 'studio-john-doe',
            'description' => 'Mon studio de photographie',
            'is_active' => true,
        ]);

        // Ajouter John comme Owner
        $ownerRole = TeamRole::where('slug', 'owner')->first();
        TeamMember::create([
            'team_id' => $team->id,
            'user_id' => $user->id,
            'team_role_id' => $ownerRole->id,
            'is_active' => true,
            'joined_at' => now(),
        ]);

        // Définir l'équipe courante
        $user->update(['current_team_id' => $team->id]);

        $this->command->info(' Base de données seedée avec succès !');
        $this->command->info('📧 admin@tasho.app / password');
        $this->command->info('📧 john@example.com / password');
    }
}