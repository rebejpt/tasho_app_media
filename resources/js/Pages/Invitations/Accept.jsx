import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Accept({ invitation, hasAccount }) {
    const [showRegister, setShowRegister] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: invitation.email || '',
        password: '',
        password_confirmation: '',
    });

    const handleLogin = () => {
        // Rediriger vers la page de connexion avec l'invitation
        window.location.href = route('login') + '?redirect=' + route('invitation.accept', invitation.token);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        post(route('invitation.register', invitation.token));
    };

    const handleAccept = () => {
        post(route('invitation.acceptWithAccount', invitation.token));
    };

    return (
        <GuestLayout>
            <Head title="Rejoindre une équipe" />

            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Invitation à rejoindre</h2>
                <p className="text-xl font-semibold text-blue-600 mt-2">{invitation.team.name}</p>
                <p className="text-sm text-gray-500 mt-1">Rôle : {invitation.team_role.name}</p>
                <p className="text-xs text-gray-400 mt-2">Expire le : {new Date(invitation.expires_at).toLocaleDateString()}</p>
            </div>

            {hasAccount ? (
                <div className="space-y-4">
                    <p className="text-gray-600 text-center">
                        Vous êtes déjà connecté. Souhaitez-vous rejoindre cette équipe ?
                    </p>
                    <button
                        onClick={handleAccept}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Accepter l'invitation
                    </button>
                </div>
            ) : (
                <div>
                    {!showRegister ? (
                        <div className="space-y-4">
                            <p className="text-gray-600 text-center">
                                Vous n'avez pas de compte ? Créez-en un pour rejoindre l'équipe.
                            </p>
                            <button
                                onClick={() => setShowRegister(true)}
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Créer un compte
                            </button>
                            <button
                                onClick={handleLogin}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                J'ai déjà un compte
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nom complet</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                Créer mon compte et rejoindre
                            </button>
                        </form>
                    )}
                </div>
            )}
        </GuestLayout>
    );
}