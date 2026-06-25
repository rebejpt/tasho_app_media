import { Head, Link, router, useForm } from '@inertiajs/react';
import ProfessionalLayout from '@/Layouts/ProfessionalLayout';
import { useState } from 'react';

export default function Show({ team, teamRoles, currentUserRole }) {
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [invitationLink, setInvitationLink] = useState(null);
    
    const isOwnerOrManager = ['owner', 'manager'].includes(currentUserRole?.slug);
    const isOwner = currentUserRole?.slug === 'owner';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        team_role_id: '',
    });

    const submitInvitation = (e) => {
        e.preventDefault();
        post(route('teams.invitations.store', team.id), {
            onSuccess: (response) => {
                // Récupérer le lien d'invitation depuis la réponse
                const link = response.props?.flash?.link || null;
                setInvitationLink(link);
                reset();
                setShowInviteForm(false);
            },
        });
    };

    const removeMember = (memberId) => {
        if (confirm('Voulez-vous vraiment retirer ce membre ?')) {
            router.delete(route('teams.members.destroy', { team: team.id, member: memberId }));
        }
    };

    const changeRole = (memberId, roleId) => {
        router.put(route('teams.members.update', { team: team.id, member: memberId }), {
            team_role_id: roleId,
        });
    };

    const switchTeam = () => {
        router.post(route('teams.switch', team.id));
    };

    const copyLink = (link) => {
        navigator.clipboard.writeText(link);
        alert('Lien copié dans le presse-papier !');
    };

    return (
        <ProfessionalLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{team.name}</h2>}
        >
            <Head title={team.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête de l'équipe */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold">{team.name}</h1>
                                    <p className="text-gray-600 mt-1">{team.description}</p>
                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-sm text-gray-500">
                                            {team.team_members?.length || 0} membres
                                        </span>
                                        {team.owner_id === window.auth?.user?.id && (
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                Vous êtes le propriétaire
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {isOwnerOrManager && (
                                        <button
                                            onClick={() => setShowInviteForm(!showInviteForm)}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            + Inviter
                                        </button>
                                    )}
                                    <button
                                        onClick={switchTeam}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Activer
                                    </button>
                                    {isOwner && (
                                        <Link
                                            href={route('teams.edit', team.id)}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Modifier
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Formulaire d'invitation */}
                            {showInviteForm && isOwnerOrManager && (
                                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                                    <h4 className="font-semibold mb-4">Inviter un nouveau membre</h4>
                                    <form onSubmit={submitInvitation} className="flex flex-wrap gap-4 items-end">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-sm text-gray-700 mb-1">Email (optionnel)</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="email@exemple.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                        <div className="min-w-[150px]">
                                            <label className="block text-sm text-gray-700 mb-1">Rôle</label>
                                            <select
                                                value={data.team_role_id}
                                                onChange={(e) => setData('team_role_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            >
                                                <option value="">Choisir...</option>
                                                {teamRoles.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.team_role_id && <p className="text-red-500 text-sm mt-1">{errors.team_role_id}</p>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                        >
                                            Générer le lien
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Lien d'invitation généré */}
                            {invitationLink && (
                                <div className="mb-6 p-4 border rounded-lg bg-green-50">
                                    <p className="text-sm font-semibold text-green-800">✅ Lien d'invitation créé :</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={invitationLink}
                                            readOnly
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white"
                                        />
                                        <button
                                            onClick={() => copyLink(invitationLink)}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Copier
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Ce lien expire dans 7 jours.</p>
                                </div>
                            )}

                            {/* Liste des membres */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">Membres</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                                                {isOwnerOrManager && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {team.team_members?.map((member) => (
                                                <tr key={member.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                        {member.user?.name}
                                                        {member.user?.id === team.owner_id && (
                                                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                                                Owner
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{member.user?.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {isOwnerOrManager && member.team_role?.slug !== 'owner' ? (
                                                            <select
                                                                value={member.team_role_id}
                                                                onChange={(e) => changeRole(member.id, e.target.value)}
                                                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                            >
                                                                {teamRoles.map((role) => (
                                                                    <option key={role.id} value={role.id}>
                                                                        {role.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                                {member.team_role?.name}
                                                            </span>
                                                        )}
                                                    </td>
                                                    {isOwnerOrManager && member.team_role?.slug !== 'owner' && (
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => removeMember(member.id)}
                                                                className="text-red-600 hover:text-red-900 text-sm"
                                                            >
                                                                Retirer
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProfessionalLayout>
    );
}