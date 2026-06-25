import { Head, Link, router } from '@inertiajs/react';
import ProfessionalLayout from '@/Layouts/ProfessionalLayout';

export default function Show({ project }) {
    const deleteProject = () => {
        if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
            router.delete(route('projects.destroy', project.id));
        }
    };

    const shareProject = () => {
        router.post(route('projects.share', project.id));
    };

    return (
        <ProfessionalLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{project.title}</h2>}
        >
            <Head title={project.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold">{project.title}</h1>
                                    <p className="text-gray-600 mt-1">{project.description}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                            project.status === 'archived' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {project.status}
                                        </span>
                                        {project.client_name && (
                                            <span className="text-sm text-gray-500">Client: {project.client_name}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={shareProject}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Partager
                                    </button>
                                    <Link
                                        href={route('projects.edit', project.id)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        onClick={deleteProject}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Fichiers</h3>
                                    <Link
                                        href={route('files.index', project.id)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Gérer les fichiers
                                    </Link>
                                </div>
                                {project.files?.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Aucun fichier pour le moment.</p>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {project.files?.map((file) => (
                                            <div key={file.id} className="border rounded-lg p-3">
                                                <p className="font-medium text-sm truncate">{file.original_name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {project.share_token && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-semibold">Lien de partage :</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={route('gallery', project.share_token)}
                                            readOnly
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(route('gallery', project.share_token));
                                                alert('Lien copié !');
                                            }}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Copier
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProfessionalLayout>
    );
}