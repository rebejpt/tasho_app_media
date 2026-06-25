<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = Subscription::with(['user', 'plan'])->get();
        $users = User::where('system_role', 'professional')->get();
        $plans = Plan::all();

        return Inertia::render('Admin/Subscriptions', [
            'subscriptions' => $subscriptions,
            'users' => $users,
            'plans' => $plans,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date',
            'expiration_date' => 'nullable|date|after:start_date',
        ]);

        Subscription::create([
            'user_id' => $request->user_id,
            'plan_id' => $request->plan_id,
            'start_date' => $request->start_date,
            'expiration_date' => $request->expiration_date,
            'is_active' => true,
        ]);

        return redirect()->route('admin.subscriptions')->with('success', 'Abonnement créé.');
    }

    public function update(Request $request, Subscription $subscription)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'expiration_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $subscription->update($request->only(['plan_id', 'expiration_date', 'is_active']));

        return redirect()->route('admin.subscriptions')->with('success', 'Abonnement mis à jour.');
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();
        return redirect()->route('admin.subscriptions')->with('success', 'Abonnement supprimé.');
    }
}