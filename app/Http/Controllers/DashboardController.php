<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Team;
use App\Models\Project;
// use App\Models\File;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->system_role === 'super_admin') {
            return $this->adminDashboard();
        }

        return $this->professionalDashboard();
    }

    private function adminDashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_teams' => Team::count(),
            'total_projects' => Project::count(),
            // ✅ Vérifier si la table files existe avant de faire la requête
            'total_files' => $this->safeCount('files'),
            'total_storage' => $this->safeSum('files', 'size'),
            'active_users' => User::where('is_active', true)->count(),
        ];

        $recentUsers = User::latest()->take(5)->get();
        $recentProjects = Project::with('team')->latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentProjects' => $recentProjects,
        ]);
    }

    private function professionalDashboard()
    {
        $user = Auth::user();
        $team = $user->currentTeam;

        if ($team) {
            $projects = Project::where('team_id', $team->id)->count();
            $files = $this->safeCount('files', ['project_id' => $team->projects()->pluck('id')->toArray()]);
            $members = $team->members()->count();
            $storage = $this->safeSum('files', 'size', ['project_id' => $team->projects()->pluck('id')->toArray()]);
        } else {
            $projects = 0;
            $files = 0;
            $members = 0;
            $storage = 0;
        }

        $recentProjects = $team ? Project::where('team_id', $team->id)->latest()->take(5)->get() : [];

        return Inertia::render('Dashboard', [
            'stats' => [
                'projects' => $projects,
                'files' => $files,
                'members' => $members,
                'storage' => $storage,
                'storage_formatted' => $this->formatBytes($storage),
            ],
            'recentProjects' => $recentProjects,
            'team' => $team,
        ]);
    }

    // ✅ Méthodes de sécurité pour vérifier l'existence des tables
    private function safeCount($table, $conditions = [])
    {
        try {
            if (empty($conditions)) {
                return \DB::table($table)->count();
            }
            return \DB::table($table)->where($conditions)->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function safeSum($table, $column, $conditions = [])
    {
        try {
            if (empty($conditions)) {
                return \DB::table($table)->sum($column) ?? 0;
            }
            return \DB::table($table)->where($conditions)->sum($column) ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function formatBytes($bytes, $precision = 2)
    {
        if ($bytes == 0) return '0 B';
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}