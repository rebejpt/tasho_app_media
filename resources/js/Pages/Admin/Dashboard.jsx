import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';  // ✅ Utiliser AdminLayout

export default function AdminDashboard({ stats }) {
    return (
        <AdminLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Admin</h2>}
        >
            <Head title="Dashboard Admin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                            <p className="mt-4">Bienvenue sur le tableau de bord administrateur.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}