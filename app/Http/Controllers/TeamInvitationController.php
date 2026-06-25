<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\TeamMember;
use App\Models\TeamRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamInvitationController extends Controller
{
    // Créer une invitation
    public function store(Request $request, Team $team)
    {
        $this->authorize('update', $team);

        $request->validate([
            'email' => 'nullable|email|max:255',
            'team_role_id' => 'required|exists:team_roles,id',
        ]);

        // Vérifier si l'utilisateur existe déjà
        if ($request->email) {
            $user = User::where('email', $request->email)->first();
            if ($user) {
                $existingMember = TeamMember::where('team_id', $team->id)
                    ->where('user_id', $user->id)
                    ->first();
                if ($existingMember) {
                    return back()->with('error', 'Cet utilisateur est déjà membre de l\'équipe.');
                }
            }

            $existingInvitation = TeamInvitation::where('team_id', $team->id)
                ->where('email', $request->email)
                ->where('is_used', false)
                ->first();

            if ($existingInvitation) {
                return back()->with('error', 'Une invitation a déjà été envoyée à cet email.');
            }
        }

        $invitation = TeamInvitation::create([
            'team_id' => $team->id,
            'invited_by' => Auth::id(),
            'email' => $request->email,
            'team_role_id' => $request->team_role_id,
            'token' => Str::random(32),
            'is_used' => false,
            'expires_at' => now()->addDays(7),
        ]);

        $link = route('invitation.accept', $invitation->token);

        return redirect()->route('teams.show', $team)->with('success', "Lien d'invitation créé : {$link}");
    }

    // Afficher la page d'acceptation
    public function accept($token)
    {
        $invitation = TeamInvitation::with(['team', 'teamRole'])
            ->where('token', $token)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        return Inertia::render('Invitations/Accept', [
            'invitation' => $invitation,
            'hasAccount' => Auth::check(),
        ]);
    }

    // Accepter l'invitation (utilisateur connecté)
    public function acceptWithAccount($token)
    {
        $invitation = TeamInvitation::with(['team', 'teamRole'])
            ->where('token', $token)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $user = Auth::user();

        $existingMember = TeamMember::where('team_id', $invitation->team_id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingMember) {
            return redirect()->route('teams.show', $invitation->team_id)
                ->with('info', 'Vous êtes déjà membre de cette équipe.');
        }

        TeamMember::create([
            'team_id' => $invitation->team_id,
            'user_id' => $user->id,
            'team_role_id' => $invitation->team_role_id,
            'is_active' => true,
            'joined_at' => now(),
        ]);

        $invitation->update(['is_used' => true]);

        if (!$user->current_team_id) {
            $user->update(['current_team_id' => $invitation->team_id]);
        }

        return redirect()->route('dashboard')->with('success', 'Vous avez rejoint l\'équipe avec succès.');
    }

    // Accepter l'invitation (utilisateur non connecté)
    public function acceptWithoutAccount(Request $request, $token)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        $invitation = TeamInvitation::with(['team', 'teamRole'])
            ->where('token', $token)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        // Créer l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'system_role' => 'professional',
            'is_active' => true,
        ]);

        // Ajouter à l'équipe
        TeamMember::create([
            'team_id' => $invitation->team_id,
            'user_id' => $user->id,
            'team_role_id' => $invitation->team_role_id,
            'is_active' => true,
            'joined_at' => now(),
        ]);

        $invitation->update(['is_used' => true]);

        Auth::login($user);
        $user->update(['current_team_id' => $invitation->team_id]);

        return redirect()->route('dashboard')->with('success', 'Compte créé et équipe rejointe avec succès.');
    }

    // Annuler une invitation
    public function destroy(Team $team, TeamInvitation $invitation)
    {
        $this->authorize('update', $team);
        $invitation->delete();
        
        return redirect()->route('teams.show', $team)->with('success', 'Invitation annulée.');
    }
}