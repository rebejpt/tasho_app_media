<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Vérifier le rôle système
        if (!in_array($user->system_role, $roles)) {
            abort(403, 'Accès non autorisé. Vous devez avoir le rôle : ' . implode(', ', $roles));
        }

        return $next($request);
    }
}