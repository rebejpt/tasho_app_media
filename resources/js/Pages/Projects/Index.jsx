import { Head, Link } from '@inertiajs/react';
import ProfessionalLayout from '@/Layouts/ProfessionalLayout';

export default function ProjectsIndex({ projects, team }) {
    const statusColors = {
        draft: 'bg-gray-100 text-gray-800',
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        archived: 'bg-red-100 text-red-800',
    };

    return (
        <ProfessionalLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mes projets</h2>}
        >
            <Head title="Mes projets" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Projets</h1>
                        <Link
                            href={route('projects.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            + Nouveau projet
                        </Link>
                    </div>

                    {!team ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="text-yellow-700">
                                Vous devez avoir une équipe active pour créer des projets.
                                <Link href={route('teams.index')} className="ml-2 text-blue-500 hover:text-blue-700">
                                    Gérer mes équipes
                                </Link>
                            </p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <p className="text-gray-500">Aucun projet pour le moment.</p>
                            <Link
                                href={route('projects.create')}
                                className="inline-block mt-4 text-blue-500 hover:text-blue-700"
                            >
                                Créer votre premier projet
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <Link href={route('projects.show', project.id)}>
                                            <h3 className="text-xl font-bold hover:text-blue-500">{project.title}</h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1 truncate">{project.description}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[project.status]}`}>
                                                {project.status}
                                            </span>
                                            {project.client_name && (
                                                <span className="text-sm text-gray-500">{project.client_name}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProfessionalLayout>
    );
}