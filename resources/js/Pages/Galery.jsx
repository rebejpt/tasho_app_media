import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Gallery({ project, access }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const { data, setData, post, processing } = useForm({
        comment: '',
    });

    const submitComment = (e) => {
        e.preventDefault();
        post(route('gallery.comment', access.access_token));
    };

    const toggleFavorite = (fileId) => {
        post(route('gallery.favorite', access.access_token), { file_id: fileId });
    };

    const downloadFile = (fileId) => {
        window.location.href = route('gallery.download', [access.access_token, fileId]);
    };

    return (
        <>
            <Head title={project.title} />
            
            <div className="min-h-screen bg-gray-100">
                {/* En-tête */}
                <div className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                        {project.client_name && (
                            <p className="text-sm text-gray-500">Client : {project.client_name}</p>
                        )}
                    </div>
                </div>

                {/* Galerie */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {project.files?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Aucun fichier disponible pour le moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.files.map((file) => (
                                <div key={file.id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="p-4">
                                        <p className="font-medium truncate">{file.original_name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            {access.allow_downloads && (
                                                <button
                                                    onClick={() => downloadFile(file.id)}
                                                    className="text-sm bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                                >
                                                    Télécharger
                                                </button>
                                            )}
                                            <button
                                                onClick={() => toggleFavorite(file.id)}
                                                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                                            >
                                                ⭐
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Commentaires */}
                    {access.allow_comments && (
                        <div className="mt-8 bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">Commentaires</h3>
                            
                            <form onSubmit={submitComment} className="flex gap-2">
                                <input
                                    type="text"
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Votre commentaire..."
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                >
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}