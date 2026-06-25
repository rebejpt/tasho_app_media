import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatsCard from '@/Components/StatsCard';

export default function Dashboard({ stats, recentProjects, team }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatsCard
                            title="Projets"
                            value={stats.projects}
                            icon="projects"
                            color="blue"
                        />
                        <StatsCard
                            title="Fichiers"
                            value={stats.files}
                            icon="files"
                            color="orange"
                        />
                        <StatsCard
                            title="Membres"
                            value={stats.members}
                            icon="users"
                            color="green"
                        />
                        <StatsCard
                            title="Stockage"
                            value={stats.storage_formatted}
                            icon="teams"
                            color="purple"
                        />

                    </div>

                    {/* Équipe active */}
                    {team && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Équipe active</h3>
                                <p className="text-gray-600">{team.name}</p>
                                <p className="text-sm text-gray-500">{team.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Projets récents */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Projets récents</h3>
                            {recentProjects.length === 0 ? (
                                <p className="text-gray-500">Aucun projet pour le moment.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {recentProjects.map((project) => (
                                        <li key={project.id} className="py-3">
                                            <p className="font-medium">{project.title}</p>
                                            <p className="text-sm text-gray-500">
                                                Statut : {project.status} | {project.project_date}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}