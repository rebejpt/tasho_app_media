<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\TeamRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['currentTeam'])->get();
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'system_role' => 'required|in:super_admin,professional',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'system_role' => $request->system_role,
            'is_active' => true,
        ]);

        return redirect()->route('admin.users')->with('success', 'Utilisateur créé avec succès.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'system_role' => 'required|in:super_admin,professional',
        ]);

        $user->update($request->only(['name', 'email', 'system_role']));

        return redirect()->route('admin.users')->with('success', 'Utilisateur mis à jour.');
    }

    public function destroy(User $user)
    {
        // Ne pas supprimer si c'est le dernier Super Admin
        if ($user->system_role === 'super_admin') {
            $superAdmins = User::where('system_role', 'super_admin')->count();
            if ($superAdmins <= 1) {
                return back()->with('error', 'Impossible de supprimer le dernier Super Admin.');
            }
        }

        $user->delete();
        return redirect()->route('admin.users')->with('success', 'Utilisateur supprimé.');
    }

    public function toggleActive(User $user)
    {
        // Ne pas désactiver le Super Admin si c'est le dernier
        if ($user->system_role === 'super_admin') {
            $superAdmins = User::where('system_role', 'super_admin')->count();
            if ($superAdmins <= 1 && $user->is_active) {
                return back()->with('error', 'Impossible de désactiver le dernier Super Admin.');
            }
        }

        $user->update(['is_active' => !$user->is_active]);
        return redirect()->route('admin.users')->with('success', 'Statut de l\'utilisateur mis à jour.');
    }
}