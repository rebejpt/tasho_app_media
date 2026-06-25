<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;
use App\Models\TeamInvitation;

class TeamPolicy
{
    public function update(User $user, Team $team)
    {
        $member = $user->teamMembers()->where('team_id', $team->id)->first();
        return $member && $member->teamRole && in_array($member->teamRole->slug, ['owner', 'manager']);
    }

    public function delete(User $user, Team $team)
    {
        $member = $user->teamMembers()->where('team_id', $team->id)->first();
        return $member && $member->teamRole && $member->teamRole->slug === 'owner';
    }

    public function view(User $user, Team $team)
    {
        return $user->teamMembers()->where('team_id', $team->id)->exists();
    }
}

class TeamInvitationPolicy
{
    public function delete(User $user, TeamInvitation $invitation)
    {
        $team = $invitation->team;
        $member = $user->teamMembers()->where('team_id', $team->id)->first();
        return $member && $member->teamRole && in_array($member->teamRole->slug, ['owner', 'manager']);
    }
}