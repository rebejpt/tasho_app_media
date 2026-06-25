<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TeamRoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        
        // Récupérer l'ID de l'équipe depuis la route ou depuis l'utilisateur
        $teamId = $request->route('team') ?? $user->current_team_id;

        if (!$teamId) {
            abort(403, 'Aucune équipe sélectionnée.');
        }

        // Vérifier si l'utilisateur est membre de l'équipe
        $member = $user->teamMembers()->where('team_id', $teamId)->first();

        if (!$member) {
            abort(403, 'Vous n\'êtes pas membre de cette équipe.');
        }

        // Vérifier si le membre a un rôle d'équipe
        if (!$member->teamRole) {
            abort(403, 'Vous n\'avez pas de rôle dans cette équipe.');
        }

        // Vérifier le rôle d'équipe
        if (!in_array($member->teamRole->slug, $roles)) {
            abort(403, 'Vous n\'avez pas les permissions nécessaires dans cette équipe. Rôle requis : ' . implode(', ', $roles));
        }

        return $next($request);
    }
}