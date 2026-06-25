import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function TeamsIndex({ teams, currentTeam }) {
    const switchTeam = (teamId) => {
        router.post(route('teams.switch', teamId));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mes équipes</h2>}
        >
            <Head title="Mes équipes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Mes équipes</h1>
                        <Link
                            href={route('teams.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            + Créer une équipe
                        </Link>
                    </div>

                    {teams.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <p className="text-gray-500">Vous n'avez pas encore d'équipe.</p>
                            <Link
                                href={route('teams.create')}
                                className="inline-block mt-4 text-blue-500 hover:text-blue-700"
                            >
                                Créer votre première équipe
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teams.map((team) => (
                                <div key={team.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <Link href={route('teams.show', team.id)}>
                                            <h3 className="text-xl font-bold hover:text-blue-500">{team.name}</h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">{team.description}</p>
                                        
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                {team.team_members?.length || 0} membres
                                            </span>
                                            {currentTeam?.id === team.id ? (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    Active
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => switchTeam(team.id)}
                                                    className="text-sm text-blue-500 hover:text-blue-700"
                                                >
                                                    Activer
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="mt-4 flex gap-2">
                                            <Link
                                                href={route('teams.show', team.id)}
                                                className="text-sm text-gray-600 hover:text-gray-900"
                                            >
                                                Voir
                                            </Link>
                                            {currentTeam?.id === team.id && (
                                                <Link
                                                    href={route('teams.edit', team.id)}
                                                    className="text-sm text-blue-500 hover:text-blue-700"
                                                >
                                                    Modifier
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}