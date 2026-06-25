import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatsCard from '@/Components/StatsCard';

export default function AdminDashboard({ stats, recentUsers, recentProjects }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Admin</h2>}
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatsCard
                            title="Utilisateurs"
                            value={stats.total_users}
                            icon="users"
                            color="blue"
                        />
                        <StatsCard
                            title="Équipes"
                            value={stats.total_teams}
                            icon="teams"
                            color="green"
                        />
                        <StatsCard
                            title="Projets"
                            value={stats.total_projects}
                            icon="projects"
                            color="purple"
                        />
                        <StatsCard
                            title="Fichiers"
                            value={stats.total_files}
                            icon="files"
                            color="orange"
                        />
                    </div>

                    {/* Graphiques / Détails */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Derniers utilisateurs</h3>
                                <ul className="divide-y divide-gray-200">
                                    {recentUsers.map((user) => (
                                        <li key={user.id} className="py-3 flex justify-between">
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Derniers projets</h3>
                                <ul className="divide-y divide-gray-200">
                                    {recentProjects.map((project) => (
                                        <li key={project.id} className="py-3">
                                            <p className="font-medium">{project.title}</p>
                                            <p className="text-sm text-gray-500">{project.team?.name || 'Sans équipe'}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}