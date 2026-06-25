<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\TeamMemberController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ============================================
// ROUTES PUBLIQUES
// ============================================
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ============================================
// ROUTES D'AUTHENTIFICATION (Breeze)
// ============================================
require __DIR__.'/auth.php';

// ============================================
// ROUTES PROTÉGÉES (AUTHENTIFICATION REQUISE)
// ============================================
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard - redirige vers le bon dashboard selon le rôle
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ============================================
// ROUTES SUPER ADMIN
// ============================================
Route::middleware(['auth', 'verified', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
    // Gestion des utilisateurs
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/toggle', [UserController::class, 'toggleActive'])->name('users.toggle');
    
    // Gestion des abonnements (manuel)
    Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions');
    Route::post('/subscriptions', [SubscriptionController::class, 'store'])->name('subscriptions.store');
    Route::put('/subscriptions/{subscription}', [SubscriptionController::class, 'update'])->name('subscriptions.update');
    Route::delete('/subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])->name('subscriptions.destroy');
    
    // Audit logs
    Route::get('/audit', [AuditLogController::class, 'index'])->name('audit');
});

// ============================================
// ROUTES PROFESSIONNEL
// ============================================
Route::middleware(['auth', 'verified', 'role:professional'])->group(function () {
    
    // ===== GESTION DES ÉQUIPES =====
    Route::prefix('teams')->name('teams.')->group(function () {
        Route::get('/', [TeamController::class, 'index'])->name('index');
        Route::get('/create', [TeamController::class, 'create'])->name('create');
        Route::post('/', [TeamController::class, 'store'])->name('store');
        Route::get('/{team}', [TeamController::class, 'show'])->name('show');
        Route::post('/{team}/switch', [TeamController::class, 'switch'])->name('switch');
        
        // Routes avec vérification du rôle d'équipe (owner ou manager)
        Route::middleware(['team.role:owner,manager'])->group(function () {
            Route::get('/{team}/edit', [TeamController::class, 'edit'])->name('edit');
            Route::put('/{team}', [TeamController::class, 'update'])->name('update');
            Route::delete('/{team}', [TeamController::class, 'destroy'])->name('destroy');
            
            // Gestion des membres
            Route::get('/{team}/members', [TeamMemberController::class, 'index'])->name('members');
            Route::post('/{team}/members', [TeamMemberController::class, 'store'])->name('members.store');
            Route::put('/{team}/members/{member}', [TeamMemberController::class, 'update'])->name('members.update');
            Route::delete('/{team}/members/{member}', [TeamMemberController::class, 'destroy'])->name('members.destroy');
        });
    });
    
    // ===== GESTION DES PROJETS =====
    Route::resource('projects', ProjectController::class);
    
    // ===== GESTION DES FICHIERS =====
    Route::prefix('projects/{project}')->group(function () {
        Route::get('/files', [FileController::class, 'index'])->name('files.index');
        Route::post('/files', [FileController::class, 'store'])->name('files.store');
    });
    Route::get('/files/{file}/download', [FileController::class, 'download'])->name('files.download');
    Route::delete('/files/{file}', [FileController::class, 'destroy'])->name('files.destroy');
});

// ============================================
// ROUTES PUBLIQUES D'INVITATION
// ============================================
Route::get('/invitation/{token}', [TeamInvitationController::class, 'accept'])->name('invitation.accept');
Route::post('/invitation/{token}/accept', [TeamInvitationController::class, 'acceptWithAccount'])->name('invitation.acceptWithAccount');
Route::post('/invitation/{token}/register', [TeamInvitationController::class, 'acceptWithoutAccount'])->name('invitation.register');

// ============================================
// ROUTES CLIENTS (GALERIE PUBLIQUE)
// ============================================
Route::get('/gallery/{token}', [ClientController::class, 'gallery'])->name('gallery');
Route::post('/gallery/{token}/favorite', [ClientController::class, 'favorite'])->name('gallery.favorite');
Route::post('/gallery/{token}/comment', [ClientController::class, 'comment'])->name('gallery.comment');
Route::get('/gallery/{token}/download/{file}', [ClientController::class, 'download'])->name('gallery.download');

// ============================================
// ROUTE DE DÉCONNEXION
// ============================================
Route::post('/logout', function () {
    auth()->logout();
    return redirect('/');
})->name('logout');