<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\TeamRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $teams = $user->teams()->with(['teamMembers.user', 'teamMembers.teamRole'])->get();
        
        return Inertia::render('Teams/Index', [
            'teams' => $teams,
            'currentTeam' => $user->currentTeam,
        ]);
    }

    public function create()
    {
        return Inertia::render('Teams/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        $team = Team::create([
            'owner_id' => $user->id,
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(6),
            'description' => $request->description,
            'is_active' => true,
        ]);

        $ownerRole = TeamRole::where('slug', 'owner')->first();
        
        TeamMember::create([
            'team_id' => $team->id,
            'user_id' => $user->id,
            'team_role_id' => $ownerRole->id,
            'is_active' => true,
            'joined_at' => now(),
        ]);

        $user->update(['current_team_id' => $team->id]);

        return redirect()->route('teams.index')->with('success', 'Équipe créée avec succès.');
    }

    public function show(Team $team)
    {
        $this->authorize('view', $team);
        
        $team->load(['teamMembers.user', 'teamMembers.teamRole', 'projects']);
        $teamRoles = TeamRole::all();
        
        return Inertia::render('Teams/Show', [
            'team' => $team,
            'teamRoles' => $teamRoles,
            'currentUserRole' => auth()->user()->teamMembers()->where('team_id', $team->id)->first()->teamRole,
        ]);
    }

    public function edit(Team $team)
    {
        $this->authorize('update', $team);
        
        return Inertia::render('Teams/Edit', [
            'team' => $team,
        ]);
    }

    public function update(Request $request, Team $team)
    {
        $this->authorize('update', $team);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $team->update($request->only(['name', 'description']));

        return redirect()->route('teams.index')->with('success', 'Équipe mise à jour.');
    }

    public function destroy(Team $team)
    {
        $this->authorize('delete', $team);
        
        $user = Auth::user();
        
        // Si c'est l'équipe courante, la désactiver
        if ($user->current_team_id === $team->id) {
            $user->update(['current_team_id' => null]);
        }
        
        $team->delete();
        
        return redirect()->route('teams.index')->with('success', 'Équipe supprimée.');
    }

    public function switch(Team $team)
    {
        $user = Auth::user();
        
        $member = $user->teamMembers()->where('team_id', $team->id)->first();
        if (!$member) {
            abort(403, 'Vous n\'êtes pas membre de cette équipe.');
        }

        $user->update(['current_team_id' => $team->id]);

        return redirect()->route('dashboard')->with('success', 'Équipe changée avec succès.');
    }
}