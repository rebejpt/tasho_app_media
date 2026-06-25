<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectAccess;
use App\Models\File;
use App\Models\Comment;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function gallery($token)
    {
        $access = ProjectAccess::with(['project.files'])
            ->where('access_token', $token)
            ->where('is_active', true)
            ->where(function ($query) {
                $query->where('expires_at', '>', now())
                    ->orWhereNull('expires_at');
            })
            ->firstOrFail();

        // Log de l'accès
        \App\Models\AccessLog::create([
            'project_id' => $access->project_id,
            'email' => $access->client_email,
            'action' => 'view_gallery',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return Inertia::render('Gallery', [
            'project' => $access->project,
            'access' => $access,
        ]);
    }

    public function download($token, File $file)
    {
        $access = ProjectAccess::where('access_token', $token)
            ->where('is_active', true)
            ->firstOrFail();

        if (!$access->project->allow_downloads) {
            abort(403, 'Les téléchargements sont désactivés pour ce projet.');
        }

        // Log de téléchargement
        \App\Models\AccessLog::create([
            'project_id' => $access->project_id,
            'file_id' => $file->id,
            'email' => $access->client_email,
            'action' => 'download',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return Storage::disk('public')->download($file->path, $file->original_name);
    }

    public function favorite($token, Request $request)
    {
        $access = ProjectAccess::where('access_token', $token)
            ->where('is_active', true)
            ->firstOrFail();

        $file = File::findOrFail($request->file_id);

        $favorite = Favorite::where('file_id', $file->id)
            ->where('project_id', $access->project_id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            $message = 'Favori retiré';
        } else {
            Favorite::create([
                'file_id' => $file->id,
                'project_id' => $access->project_id,
            ]);
            $message = 'Favori ajouté';
        }

        return back()->with('success', $message);
    }

    public function comment($token, Request $request)
    {
        $access = ProjectAccess::where('access_token', $token)
            ->where('is_active', true)
            ->firstOrFail();

        if (!$access->project->allow_comments) {
            abort(403, 'Les commentaires sont désactivés pour ce projet.');
        }

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        Comment::create([
            'project_id' => $access->project_id,
            'author_name' => $access->client_email,
            'author_email' => $access->client_email,
            'content' => $request->content,
            'is_approved' => true,
        ]);

        return back()->with('success', 'Commentaire ajouté.');
    }
}