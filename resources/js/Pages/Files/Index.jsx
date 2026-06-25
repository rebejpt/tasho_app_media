import { Head, useForm, router } from '@inertiajs/react';
import ProfessionalLayout from '@/Layouts/ProfessionalLayout';
import { useState } from 'react';

export default function FilesIndex({ project, files, folders }) {
    const [uploading, setUploading] = useState(false);
    const { data, setData, post, progress } = useForm({
        file: null,
        folder_id: '',
    });

    const handleFileChange = (e) => {
        setData('file', e.target.files[0]);
    };

    const uploadFile = (e) => {
        e.preventDefault();
        setUploading(true);
        post(route('files.store', project.id), {
            onFinish: () => {
                setUploading(false);
                setData('file', null);
                document.getElementById('fileInput').value = '';
            },
        });
    };

    const deleteFile = (fileId) => {
        if (confirm('Voulez-vous vraiment supprimer ce fichier ?')) {
            router.delete(route('files.destroy', fileId));
        }
    };

    const downloadFile = (fileId) => {
        window.location.href = route('files.download', fileId);
    };

    return (
        <ProfessionalLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Fichiers - {project.title}</h2>}
        >
            <Head title="Fichiers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={uploadFile} className="mb-8 p-4 border rounded-lg bg-gray-50">
                                <div className="flex flex-wrap gap-4 items-end">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm text-gray-700 mb-1">Fichier</label>
                                        <input
                                            id="fileInput"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div className="min-w-[150px]">
                                        <label className="block text-sm text-gray-700 mb-1">Dossier</label>
                                        <select
                                            value={data.folder_id}
                                            onChange={(e) => setData('folder_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Racine</option>
                                            {folders.map((folder) => (
                                                <option key={folder.id} value={folder.id}>
                                                    {folder.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {uploading ? 'Upload...' : 'Uploader'}
                                    </button>
                                </div>
                                {progress && (
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress.percentage}%` }}
                                        />
                                    </div>
                                )}
                            </form>

                            {files.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Aucun fichier.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {files.map((file) => (
                                                <tr key={file.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">{file.original_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{file.mime_type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => downloadFile(file.id)}
                                                            className="text-blue-500 hover:text-blue-700 mr-3"
                                                        >
                                                            Télécharger
                                                        </button>
                                                        <button
                                                            onClick={() => deleteFile(file.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProfessionalLayout>
    );
}