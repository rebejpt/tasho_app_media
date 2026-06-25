<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\TeamRole;
use App\Models\User;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeamMemberController extends Controller
{
    public function index(Team $team)
    {
        $this->authorize('view', $team);
        
        $members = $team->teamMembers()->with(['user', 'teamRole'])->get();
        $teamRoles = TeamRole::all();
        
        return Inertia::render('Teams/Members', [
            'team' => $team,
            'members' => $members,
            'teamRoles' => $teamRoles,
        ]);
    }

    public function store(Request $request, Team $team)
    {
        $this->authorize('update', $team);

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'team_role_id' => 'required|exists:team_roles,id',
        ]);

        $user = User::where('email', $request->email)->first();

        // Vérifier si déjà membre
        $existingMember = TeamMember::where('team_id', $team->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingMember) {
            return back()->with('error', 'Cet utilisateur est déjà membre de l\'équipe.');
        }

        TeamMember::create([
            'team_id' => $team->id,
            'user_id' => $user->id,
            'team_role_id' => $request->team_role_id,
            'is_active' => true,
            'joined_at' => now(),
        ]);

        return redirect()->route('teams.show', $team)->with('success', 'Membre ajouté avec succès.');
    }

    public function update(Request $request, Team $team, TeamMember $member)
    {
        $this->authorize('update', $team);

        // Empêcher la modification du propriétaire
        if ($member->teamRole->slug === 'owner') {
            return back()->with('error', 'Impossible de modifier le propriétaire de l\'équipe.');
        }

        $request->validate([
            'team_role_id' => 'required|exists:team_roles,id',
        ]);

        $member->update([
            'team_role_id' => $request->team_role_id,
        ]);

        return redirect()->route('teams.show', $team)->with('success', 'Rôle du membre mis à jour.');
    }

    public function destroy(Team $team, TeamMember $member)
    {
        $this->authorize('update', $team);

        // Empêcher la suppression du propriétaire
        if ($member->teamRole->slug === 'owner') {
            return back()->with('error', 'Impossible de supprimer le propriétaire de l\'équipe.');
        }

        $member->delete();

        return redirect()->route('teams.show', $team)->with('success', 'Membre retiré de l\'équipe.');
    }
}