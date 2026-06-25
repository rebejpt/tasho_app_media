import { Head, useForm } from '@inertiajs/react';
import ProfessionalLayout from '@/Layouts/ProfessionalLayout';

export default function Edit({ project }) {
    const { data, setData, put, processing, errors } = useForm({
        title: project.title,
        description: project.description || '',
        client_name: project.client_name || '',
        client_email: project.client_email || '',
        project_date: project.project_date || '',
        status: project.status || 'draft',
        allow_downloads: project.allow_downloads ?? true,
        allow_comments: project.allow_comments ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('projects.update', project.id));
    };

    return (
        <ProfessionalLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Modifier le projet</h2>}
        >
            <Head title="Modifier le projet" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="max-w-2xl">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Titre *</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        rows="4"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Client</label>
                                        <input
                                            type="text"
                                            value={data.client_name}
                                            onChange={(e) => setData('client_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Email client</label>
                                        <input
                                            type="email"
                                            value={data.client_email}
                                            onChange={(e) => setData('client_email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                        {errors.client_email && <p className="text-red-500 text-sm mt-1">{errors.client_email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={data.project_date}
                                            onChange={(e) => setData('project_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Statut</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="draft">Brouillon</option>
                                            <option value="active">Actif</option>
                                            <option value="completed">Terminé</option>
                                            <option value="archived">Archivé</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.allow_downloads}
                                            onChange={(e) => setData('allow_downloads', e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label className="text-sm text-gray-700">Autoriser les téléchargements</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.allow_comments}
                                            onChange={(e) => setData('allow_comments', e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label className="text-sm text-gray-700">Autoriser les commentaires</label>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        Mettre à jour
                                    </button>
                                    <a
                                        href={route('projects.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Annuler
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProfessionalLayout>
    );
}