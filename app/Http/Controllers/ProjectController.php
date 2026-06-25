<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $team = $user->currentTeam;
        
        $projects = $team ? Project::where('team_id', $team->id)->get() : collect();
        
        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'team' => $team,
        ]);
    }

    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_name' => 'nullable|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'project_date' => 'nullable|date',
            'status' => 'nullable|in:draft,active,completed,archived',
        ]);

        $user = Auth::user();
        $team = $user->currentTeam;

        if (!$team) {
            return back()->with('error', 'Vous devez avoir une équipe pour créer un projet.');
        }

        $project = Project::create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'client_name' => $request->client_name,
            'client_email' => $request->client_email,
            'project_date' => $request->project_date,
            'status' => $request->status ?? 'draft',
            'allow_downloads' => true,
            'allow_comments' => true,
        ]);

        // Créer les dossiers par défaut
        $folders = ['Photos', 'Vidéos', 'Documents'];
        foreach ($folders as $folderName) {
            Folder::create([
                'project_id' => $project->id,
                'name' => $folderName,
                'slug' => strtolower($folderName),
            ]);
        }

        return redirect()->route('projects.index')->with('success', 'Projet créé avec succès.');
    }

    public function show(Project $project)
    {
        $project->load(['files', 'folders', 'createdBy']);
        
        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }

    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,active,completed,archived',
            'allow_downloads' => 'boolean',
            'allow_comments' => 'boolean',
        ]);

        $project->update($request->only([
            'title', 'description', 'client_name', 'client_email',
            'project_date', 'status', 'allow_downloads', 'allow_comments'
        ]));

        return redirect()->route('projects.index')->with('success', 'Projet mis à jour.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return redirect()->route('projects.index')->with('success', 'Projet supprimé.');
    }

    public function share(Project $project)
    {
        // Générer un token de partage
        $project->update([
            'share_token' => \Illuminate\Support\Str::random(32),
            'shared_at' => now(),
        ]);

        $link = route('gallery', $project->share_token);

        return back()->with('success', "Lien de partage : {$link}");
    }
}