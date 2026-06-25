<?php

namespace App\Http\Controllers;

use App\Models\AccessLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AccessLog::with(['user', 'project', 'file']);

        // Filtres
        if ($request->action) {
            $query->where('action', $request->action);
        }
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->latest()->paginate(50);

        $actions = AccessLog::distinct()->pluck('action');

        return Inertia::render('Audit/Index', [
            'logs' => $logs,
            'actions' => $actions,
            'filters' => $request->only(['action', 'date_from', 'date_to']),
        ]);
    }
}