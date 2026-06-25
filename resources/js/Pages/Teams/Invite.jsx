import { Head, useForm } from '@inertiajs/react';
import ProfessionalLayout from '@/Layouts/ProfessionalLayout';

export default function Invite({ team, teamRoles }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        team_role_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('teams.invitations.store', team.id));
    };

    return (
        <ProfessionalLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Inviter un membre</h2>}
        >
            <Head title="Inviter un membre" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Inviter dans : {team.name}</h3>
                            
                            <form onSubmit={submit} className="max-w-md">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Email (optionnel)
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="email@exemple.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Rôle
                                    </label>
                                    <select
                                        value={data.team_role_id}
                                        onChange={(e) => setData('team_role_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        {teamRoles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name} - {role.description}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.team_role_id && <p className="text-red-500 text-sm mt-1">{errors.team_role_id}</p>}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        Générer le lien d'invitation
                                    </button>
                                    <a
                                        href={route('teams.show', team.id)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Annuler
                                    </a>
                                </div>
                            </form>

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    💡 Le lien d'invitation sera affiché après la création. 
                                    Vous pourrez le copier et l'envoyer à la personne.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProfessionalLayout>
    );
}