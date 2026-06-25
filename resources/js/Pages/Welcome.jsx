import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Accueil" />
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="flex justify-end gap-4">
                        {canLogin ? (
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900"
                            >
                                Se connecter
                            </Link>
                        ) : null}
                        
                        {canRegister ? (
                            <Link
                                href={route('register')}
                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900"
                            >
                                S'inscrire
                            </Link>
                        ) : null}
                    </div>

                    <div className="mt-16 text-center">
                        <h1 className="text-4xl font-bold text-gray-900">Bienvenue sur Tasho</h1>
                        <p className="mt-4 text-gray-600">La plateforme pour les professionnels des médias</p>
                        {laravelVersion && phpVersion && (
                            <p className="mt-2 text-sm text-gray-400">
                                Laravel v{laravelVersion} - PHP v{phpVersion}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}


