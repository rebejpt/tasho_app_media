import { Head } from '@inertiajs/react';
import ProfessionalLayout from '@/Layouts/ProfessionalLayout';  // ✅ Utiliser ProfessionalLayout

export default function Dashboard({ stats, recentProjects, team }) {
    return (
        <ProfessionalLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <p className="mt-4">Bienvenue sur votre espace professionnel.</p>
                            {team && (
                                <p className="mt-2">Équipe active : <strong>{team.name}</strong></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProfessionalLayout>
    );
}