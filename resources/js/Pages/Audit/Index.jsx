import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AuditIndex({ logs, actions, filters }) {
    const { data, setData, get, processing } = useForm({
        action: filters.action || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const submitFilters = (e) => {
        e.preventDefault();
        get(route('admin.audit'), data);
    };

    const getActionColor = (action) => {
        const colors = {
            view_gallery: 'bg-blue-100 text-blue-800',
            download: 'bg-green-100 text-green-800',
            comment: 'bg-yellow-100 text-yellow-800',
            favorite: 'bg-purple-100 text-purple-800',
        };
        return colors[action] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Audit Logs</h2>}
        >
            <Head title="Audit Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submitFilters} className="mb-6 flex flex-wrap gap-4 items-end">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Action</label>
                                    <select
                                        value={data.action}
                                        onChange={(e) => setData('action', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Toutes</option>
                                        {actions.map((action) => (
                                            <option key={action} value={action}>{action}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Date début</label>
                                    <input
                                        type="date"
                                        value={data.date_from}
                                        onChange={(e) => setData('date_from', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Date fin</label>
                                    <input
                                        type="date"
                                        value={data.date_to}
                                        onChange={(e) => setData('date_to', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    Filtrer
                                </button>
                            </form>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projet</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.data?.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">{log.user?.name || log.email || 'Anonyme'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{log.project?.title || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{log.ip_address || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {logs.links && (
                                <div className="mt-4 flex justify-center">
                                    {logs.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-1 mx-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}