<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Project;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FileController extends Controller
{
    public function index(Project $project)
    {
        $files = File::where('project_id', $project->id)->get();
        $folders = Folder::where('project_id', $project->id)->get();
        
        return Inertia::render('Files/Index', [
            'project' => $project,
            'files' => $files,
            'folders' => $folders,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $request->validate([
            'file' => 'required|file|max:51200', // 50MB
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $user = Auth::user();
        $uploadedFile = $request->file('file');

        $path = $uploadedFile->store("projects/{$project->id}", 'public');

        File::create([
            'project_id' => $project->id,
            'folder_id' => $request->folder_id,
            'uploaded_by' => $user->id,
            'name' => $uploadedFile->getClientOriginalName(),
            'original_name' => $uploadedFile->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $uploadedFile->getMimeType(),
            'extension' => $uploadedFile->getClientOriginalExtension(),
            'size' => $uploadedFile->getSize(),
            'metadata' => [
                'uploaded_at' => now()->toDateTimeString(),
                'uploaded_by' => $user->name,
            ],
            'is_public' => true,
        ]);

        return back()->with('success', 'Fichier uploadé avec succès.');
    }

    public function download(File $file)
    {
        // Log de téléchargement
        \App\Models\AccessLog::create([
            'user_id' => Auth::id(),
            'file_id' => $file->id,
            'project_id' => $file->project_id,
            'action' => 'download',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return Storage::disk('public')->download($file->path, $file->original_name);
    }

    public function destroy(File $file)
    {
        Storage::disk('public')->delete($file->path);
        $file->delete();
        
        return back()->with('success', 'Fichier supprimé.');
    }
}