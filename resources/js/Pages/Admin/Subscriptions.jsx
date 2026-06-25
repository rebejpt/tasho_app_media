import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Subscriptions({ subscriptions, users, plans }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        plan_id: '',
        start_date: new Date().toISOString().split('T')[0],
        expiration_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.store'), {
            onSuccess: () => {
                setShowForm(false);
                reset();
            },
        });
    };

    const deleteSubscription = (id) => {
        if (confirm('Voulez-vous vraiment supprimer cet abonnement ?')) {
            router.delete(route('admin.subscriptions.destroy', id));
        }
    };

    return (
        <AdminLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des abonnements</h2>}
        >
            <Head title="Abonnements" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Abonnements</h1>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {showForm ? 'Annuler' : '+ Nouvel abonnement'}
                                </button>
                            </div>

                            {showForm && (
                                <form onSubmit={submit} className="mb-6 p-4 border rounded-lg bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-1">Utilisateur</label>
                                            <select
                                                value={data.user_id}
                                                onChange={(e) => setData('user_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            >
                                                <option value="">Choisir...</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} ({user.email})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-1">Plan</label>
                                            <select
                                                value={data.plan_id}
                                                onChange={(e) => setData('plan_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            >
                                                <option value="">Choisir...</option>
                                                {plans.map((plan) => (
                                                    <option key={plan.id} value={plan.id}>
                                                        {plan.name} ({plan.storage_limit / 1024 / 1024 / 1024} GB)
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.plan_id && <p className="text-red-500 text-sm mt-1">{errors.plan_id}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-1">Date de début</label>
                                            <input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-1">Date d'expiration</label>
                                            <input
                                                type="date"
                                                value={data.expiration_date}
                                                onChange={(e) => setData('expiration_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        Créer
                                    </button>
                                </form>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Début</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiration</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscriptions.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">{sub.user?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{sub.plan?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{sub.start_date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{sub.expiration_date || 'Illimité'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${sub.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {sub.is_active ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => deleteSubscription(sub.id)}
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
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}